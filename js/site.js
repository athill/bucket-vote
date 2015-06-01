'use strict';
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

$(function() {
	var $buckets = $('#buckets'),
		$items = $('#items'),
		$help = $('#help'),
		$bucketlimit = $('#bucketlimit'),
		appdata = {
			buckets: {},
			items: [],
			conf: {
				bucketlimit: 10
			}
		},
		demomode = true,
		url = '/data/appdata.json';

	/* event handlers */

	//// toggle setup section visibility
	$('#setup>legend').click(toggleSetupDisplay);

	$('#help-button').click(function(e) { $help.toggle(); });

	$('#close-help-button').click(function(e) { $help.hide(); });	

	$('#conf-form').submit(function(e) { e.preventDefault(); });	

	$bucketlimit.change(changeBucketlimit);

	$('.add-form').submit(addFormSubmit);

	/* main */

	//// Load initial data/dom
	if (demomode) {
		 if (sessionStorage.getItem("data")) {
		 	console.log(sessionStorage.getItem("data"));
		 	appdata = JSON.parse(sessionStorage.getItem("data"));
		 } else {
		 	sessionStorage.setItem('data', JSON.stringify(appdata));
		 }
		 loadInitialDom();
		 console.log('sessiondata', sessionStorage.getItem("data"));
		 console.log('appdata', appdata);
	} else {
		$.ajax({
			dataType: "json",
			url: url,
			success: function(data) {
				appdata = data;
				loadInitialDom();

			}
		});
	}	

	/* helpers */

	function loadInitialDom() {
		var bucketlist = Object.keys(appdata.buckets);
		
		addBucketsToDom(bucketlist);

		addItemsToCollectionDom(appdata.items);
		$bucketlimit.val(appdata.conf.bucketlimit);
		if (appdata.items.length === 0 || bucketlist.length === 0) {
			$help.show();
			$('#setup>legend').eq(0).click();
		}
	}

	function changeBucketlimit() {
		var bucketlimit = $bucketlimit.val();
		//// if there is a reduction in bucketlimit, we need to ensure buckets 
		//// have <= bucketlimit items
		if (parseInt(bucketlimit) < parseInt(appdata.conf.bucketlimit)) {
			var over = [];
			//// determine which buckets have too many items
			for (var bucket in appdata.buckets) {
				if (appdata.buckets[bucket].length > bucketlimit) {
					over.push(bucket);
				}
			}
			if (over.length > 0) {
				var remove = confirm('The following buckets have more than '+bucketlimit+
					' items. Some will be removed. \n'+over.join(';'));
				if (remove) {
					var removes = {};
					//// remove from dom
					$('.bucket-items').each(function(i) {
						while ($(this).children().length > bucketlimit) {
							var $item = $(this).children().eq($(this).children().length - 1),
								$bucket = $(this).closest('.bucket'),
								bucket = $bucket.find('header .name').html(),
								item = $item.find('.name').html();
							if (!(bucket in removes)) {
								removes[bucket] = [];
							}
							removes[bucket].push(item);
							removeItemFromBucketDom($bucket, $item);
						}
					});
					var data = {
						action: 'delete-items-from-buckets',
						removes: removes
					};	
					//// remove from appdata
					for (var bucket in removes) {
						removes[bucket].forEach(function(item) {
							appdata.buckets[bucket].remove(item);
						});
					}
					//// update persistent data
					updateData(data, function(data) {});					
				} else {
					$bucketlimit.val(appdata.conf.bucketlimit);
					return;
				}
			}
		}
		var data = {
			action: 'update-bucketlimit',
			bucketlimit: bucketlimit
		};
		updateData(data, function(data) {});
		appdata.conf.bucketlimit = bucketlimit;
	};

	//// add new item/bucket
	
	function addFormSubmit(e) {
		e.preventDefault();
		var $namesField = $(this).find('.add-field'),
			names = $namesField.val(),
			type = $(this).prop('id').split('-')[1],
			duplicates = [],
			adds = [];
		//// empty name
		if (names === '') {
			alert('Please supply at least one '+type.replace(/s$/, ''));
			return;
		}
		names = names.split(';');
		names = names.map(function(name) {
			return name.trim();
		});
		//// name already exists
		$items.children().each(function(i) {
			var currentname = $(this).find('.name').text().trim();
			if (names.indexOf(currentname) >= 0) {
				duplicates.push(currentname);
				return false;
			}
		});
		//// wheat/chaff
		adds = names.filter(function(name) {
			return duplicates.indexOf(name) < 0;
		});
		//// all duplicates
		if (adds.length === 0) {
			alert('There are no new '+type+' to add. The following '+type+' are duplicates: ' +
				duplicates.join(';')
			);
			return;
		}
		//// some duplicates
		if (duplicates.length > 0) {
			var add = confirm('The following '+type+' are duplicates: '+duplicates.join(';')+'\n'+
				'The following '+type+' will be added: '+adds.join(';')+'\n'+
				'Do you wish to add these '+type+'?'
			);
			if (!add) {
				return;
			}
		}
		//// clear $nameField
		$namesField.val('');
		addToCollection(type, adds);
	};

    function addToCollection(typeid, names) {
		var data = {
				action: 'add-to-'+typeid
			},
			callback = (typeid === 'items') ? 
				addItemsToCollectionDom : 
				addBucketsToDom,
			success = function(data) {
				callback(names);
			};
		//// update local data
		if (typeid === 'items') {
			appdata.items = appdata.items.concat(names);
		} else {
			names.forEach(function(name) {
				appdata.buckets[name] = [];
			});
		}	
		//// update remove data
		data[typeid] = names;
		updateData(data, success);			
    }

	function updateData(data, success) {
		console.log(appdata, sessionStorage.getItem('data'));
		if (demomode) {
			sessionStorage.setItem('data', JSON.stringify(appdata));
			success();
		} else {
			$.ajax({
			    type: "GET",
			    url: "/update.php",
			    data: data,
			    contentType: "application/json; charset=utf-8",
			    dataType: "json",
			    success: success,
			    failure: function(errMsg) {
			        alert(errMsg);
			    }
			});		
		}
	}

	function removeItemFromItems(e) {
		var $item = $(this).closest('.item'),
			name = $item.find('.name').text(),
			data = {
				action: 'delete-from-items',
				item: name
			},
			success = function(data) {
				$item.remove();
				$buckets.find('.bucket-items').each(function(i) {
					$(this).find('.item').each(function(j) {
						if ($(this).find('.name').text() === name) {
							var $bucket = $(this).closest('.bucket');
							removeItemFromBucketDom($bucket, $(this));
						}
					});
				});
			};
		//// update appdata
		appdata.items.remove(name);
		for (var bucket in appdata.buckets) {
			appdata.buckets[bucket].remove(name);
		}
		//// update persistence
		updateData(data, success);
	}

	function removeBucketFromBuckets(e) {
		var $bucket = $(this).closest('.bucket'),
			name = $bucket.find('header .name').text(),
			data = {
				action: 'delete-from-buckets',
				bucket: name
			},
			success = function(data) {
				$bucket.find('.bucket-items .items').each(function(i) {
					removeItemFromBucketDom($bucket, $(this));
				});
				$bucket.remove();
			};
		delete appdata.buckets[name];
		updateData(data, success);

	}

	function removeItemFromBucket(e) {
		var $item = $(this).closest('.item'),
			$bucket = $item.closest('.bucket'),
			bucket = $bucket.find('header .name').text(),
			data = {
				action: 'delete-item-from-bucket',
				bucket: bucket,
				item: $item.find('.name').text()

			},
			success = function(data) {
				removeItemFromBucketDom($bucket, $item);	
			};
		appdata.buckets[bucket].remove($item.find('.name').text());
		updateData(data, success);

	}

	function removeItemFromBucketDom($bucket, $item) {
		var name = $item.find('.name').text(),
			id = getId(name),
			$original = $('#'+id+'-item');
		if ($original.length > 0) {
			decrement($original.find('.count'));	
		}
		decrement($bucket.find('header .count'));
		$item.remove();			
	}

	function addItemToBucketDom($bucket, $item) {

        var id = getId($item.find('.name').text()),
        	$original = $('#'+id+'-item'),
        	$remove = $item.find('.delete-button'),
        	$bucketcount = $bucket.find('header .count'),
        	$itemcount = $original.find('.count'),
        	$items = $bucket.find('.bucket-items');
    	
    	$item
    		.removeAttr('id')
    		.css({'cursor': 'auto'})
    		.find('.count').remove();
    	//// change click handler for delete button
    	$remove
    		.off('click')
    		.click(removeItemFromBucket);
    	//// add clone to items
    	if (!$items.length) {
    		$bucket.append('<div class="bucket-items"></div>');
    	}
        $items.append($item);
        //// increment parent count
        increment($bucketcount);
        //// increment item count
        increment($itemcount);
	}
	function getId(name) {
		return name.toLowerCase().replace(/ /, '-').replace(/[^a-z0-9\-]/, '');
	}
	function sortItems() {
		var $children = $items.children();
		$children.sort(function(a, b) {
			var an = $(a).find('.name').text().split(' ')[1];
			var bn = $(b).find('.name').text().split(' ')[1];
			if(an > bn) {
				return 1;
			}
			if(an < bn) {
				return -1;
			}
			return 0;			
		});
		$children.detach().appendTo($items);
	}

	function handleItemDrop(e, ui) {
    	var $draggable = $(ui.draggable),
    		$parent = $(this).parent(),
    		$children = $(this).children(),
    		add = true,
    		item = $draggable.find('.name').text(),
    		bucket = $parent.find('header .name').text();
    	//// check length
    	if ($children.length == appdata.conf.bucketlimit) {
    		alert(bucket +' already has '+appdata.conf.bucketlimit+' items');
    		add = false;
    	} else {
    		//// check duplicates
	    	$children.each(function(i) {
	    		if ($(this).find('.name').text() === item) {
	    			alert(item + ' is already in the list for '+bucket);
	    			add = false;
	    			return false;
	    		}
	    	});			    		
    	}
    	if (add) {
    		var data = {
	    			action: 'add-item-to-bucket',
	    			bucket: bucket,
	    			item: item
	    		},
    			success = function(data) {
		    		//// clone object
			    	var $clone = $draggable.clone();
			    	// $clone.draggable('destroy');
			        addItemToBucketDom($parent, $clone);
			    };		    		
		    appdata.buckets[bucket].push(item);
		    updateData(data, success);
    	}
    }

    function addBucketsToDom(buckets) {
    	//// buckets can either be [<bucket1>, ...] or { <bucket1>: [<item1, ...] }
    	var bucketsIsArray = Array.isArray(buckets);
    	var bucketlist = (bucketsIsArray) ? buckets : Object.keys(buckets);
		bucketlist.forEach(function(bucket) {
			var $bucketitems = $('<div/>').addClass('bucket-items'),
				$bucket = createBucketDom(bucket);
			$bucketitems.droppable({
			    drop: handleItemDrop
			});
			//// if buckets is object literal, get its items array, otherwise, empty array
			var items = (appdata.buckets[bucket]) ? appdata.buckets[bucket] :
				(bucketsIsArray) ?  [] : 
				buckets[bucket];
			$bucket.append($bucketitems);
			items.forEach(function(item) {
				var $item = createItemDom(item),
					$remove = createRemoveDom(removeItemFromBucket);
				$item.find('.controls').append($remove);
				addItemToBucketDom($bucket, $item);
			});		
			$buckets.append($bucket);
		});    	
    }

	function addItemsToCollectionDom(names) {
		names.forEach(function(name) {
			var $item = createItemDom(name),
				$count = createCountDom(),
				$remove = createRemoveDom(removeItemFromItems),
				$controls = $item.find('.controls'),
				count = 0;
			for (var bucket in appdata.buckets) {
				if (appdata.buckets[bucket].indexOf(name) !== -1) {
					count++;
				}
			}
			$count.html(count);
			$controls.append($count)
				.append($remove);
			$items.append($item);
		});
		sortItems();
	}

	//// DOM methods
	function createBucketDom(bucketName) {
		var $bucket = $('<div/>')
				.prop('id', getId(bucketName)+'-bucket')
				.addClass('bucket'),
			$controls = $('<div/>')
				.addClass('controls')
				.append(createCountDom())
				.append(createRemoveDom(removeBucketFromBuckets)),
			$header = $('<header/>')
				.append(createNameDom(bucketName))
				.append($controls);
		$bucket.append($header);
		return $bucket;
	}

	function createItemDom(itemName) {
		var $item = $('<div/>')
				.prop('id', getId(itemName)+'-item')
				.addClass('item')
				.append(createNameDom(itemName))
				.append($('<div/>').addClass('controls'))
				.draggable({
					helper: 'clone'
				});
		return $item;
	}

	function createNameDom(name) {
		return $('<span/>')
			.addClass('name')
			.text(name);
	}

	function createCountDom(count) {
		var count = count || 0;
		return $('<span/>')
			.addClass('count')
			.html(count);
	}

	function createRemoveDom(callback) {
    	var $remove = $('<i class="fa fa-times-circle delete-button"></i>');
    	$remove.click(callback);		
    	return $remove;
	}
	function increment($elem) {		
		var current = $elem.text();
		var next = parseInt(current) + 1;
		$elem.text(next.toString());
	}

	function decrement($elem) {
		$elem.html(parseInt($elem.html()) - 1);		
	}

	/** Form stuff */
	function toggleSetupDisplay(e) {
		var $div = $(this).parent().find('.toggle'),
			$i = $(this).find('i'),
			downclass = 'fa-caret-square-o-down',
			upclass = 'fa-caret-square-o-up';
		if ($div.css('display') === 'none') {
			$div.show();
			$i.removeClass(downclass)
				.addClass(upclass);
		} else {
			$div.hide();
			$i.removeClass(upclass)
				.addClass(downclass);
		}		
	}	
});