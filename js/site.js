'use strict';
$(function() {
	var $buckets = $('#buckets'),
		$items = $('#items'),
		$namesField = $('#add-items'),
		bucketlimit = 10;

	//// load buckets
	$.getJSON('/data/buckets.json', function(data) {
		addBucketsToDom(data);
	});
	//// load items
	$.getJSON('/data/items.json', function(data) {
		addItemsToCollectionDom(data);
	});
	//// load mappings
	$.getJSON('/data/mappings.json', function(data) {
		for (var bucket in data) {
			var $bucket = $('#'+getId(bucket)+'-bucket');
			data[bucket].forEach(function(name) {
				var $item = createItemDom(name),
					$remove = createRemoveDom(removeItemFromBucket);
				$item.append($remove);
				addItemToBucketDom($bucket, $item);
			});
		}
	});
	//// add new item/bucket
	$('.add-form').submit(function(e) {
		e.preventDefault();
		var names = $namesField.val(),
			type = $(this).attr('id').split('-')[1],
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
				// alert(currentname + ' is already in items');
				duplicates.push(currentname);
				return false;
			}
		});
		adds = names.filter(function(name) {
			return duplicates.indexOf(name) < 0;
		});
		if (adds.length === 0) {
			alert('There are no new '+type+' to add. The following '+type+' are duplicates: ' +
				duplicates.join(';')
			);
			return;
		}
		if (duplicates.length > 0) {
			var add = confirm('The following '+type+' are duplicates: '+duplicates.join(';')+'\n'+
				'The following '+type+' will be added: '+adds.join(';')+'\n'+
				'Do you wish to add these '+type+'?'
			);
			if (!add) {
				return;
			}
		}
		$namesField.val('');
		addToItems(adds);
	});

	function updateData(data, success) {
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

	function increment($elem) {		
		var current = $elem.text();
		var next = parseInt(current) + 1;
		$elem.text(next.toString());
	}

	function decrement($elem) {
		$elem.html(parseInt($elem.html()) - 1);		
	}



	function removeItemFromItems(e) {
		var $parent = $(this).parent(),
			name = $parent.find('.name').text(),
			data = {
				action: 'delete-from-items',
				item: name
			},
			success = function(data) {
				$parent.remove();
				$buckets.find('.bucket-items').each(function(i) {
					$(this).find('.item').each(function(j) {
						if ($(this).find('.name').text() === name) {
							var $bucket = $(this).closest('.bucket');
							removeItemFromBucketDom($bucket, $(this));
						}
					});
				});
			};
		updateData(data, success);
	}

	function removeItemFromBucket(e) {
		var $item = $(this).parent(),
			$bucket = $item.closest('.bucket'),
			data = {
				action: 'delete-from-bucket',
				bucket: $bucket.find('header .name').text(),
				item: $item.find('.name').text()

			},
			success = function(data) {
				removeItemFromBucketDom($bucket, $item);	
			};
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
        	$itemcount = $original.find('.count');
    	$item.removeAttr('id')
    		.css({'cursor': 'auto'})
    		.find('.count').remove();
    	//// change click handler for delete button
    	$remove.off('click')
    		.click(removeItemFromBucket);
    	//// add clone to items
        $bucket.find('.bucket-items').append($item);
        //// increment parent count
        increment($bucketcount);
        //// increment item count
        increment($itemcount);
	}
	function getId(name) {
		return name.toLowerCase().replace(/ /, '-');
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
    	if ($children.length == bucketlimit) {
    		alert(bucket +' already has '+bucketlimit+' items');
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
	    			action: 'add-to-bucket',
	    			bucket: bucket,
	    			item: item
	    		},
    			success = function(data) {
		    		//// clone object
			    	var $clone = $draggable.clone();
			        addItemToBucketDom($parent, $clone);

			    };
		    updateData(data, success);		    		

    	}
    }

    function addToItems(names) {
		var data = {
			action: 'add-to-items',
			items: names
		};
		var success = function(data) {
			addItemsToCollectionDom(names);
		}
		updateData(data, success);    	
    }


    function addBucketsToDom(buckets) {
		buckets.forEach(function(bucket) {
			var $bucketitems = $('<div class="bucket-items"></div>'),
				$bucket = createBucketDom(bucket);
			$bucketitems.droppable({
			    drop: handleItemDrop
			});
			$bucket.append($bucketitems);			
			$buckets.append($bucket);
		});    	
    }

	function addItemsToCollectionDom(names) {
		names.forEach(function(name) {
			var $item = createItemDom(name),
				$count = createCountDom(),
				$remove = createRemoveDom(removeItemFromItems);
			$item.append($count)
				.append($remove);
			$items.append($item);
		});
		sortItems();
	}

	//// DOM methods
	function createBucketDom(bucketName) {
		return $('<div class="bucket" id="'+getId(bucketName)+'-bucket">'+
					'<header>'+
						'<span class="name">'+bucketName+'</span>'+
						'<span class="count">0</span>'+
					'</header>'+
				'</div>');
	}

	function createItemDom(itemName) {
		var $item = $('<div id="'+getId(itemName)+'-item" class="item">'+
							'<span class="name">'+itemName+'</span>'+
						'</div>');
		$item.draggable({
		    helper:"clone"
		});
		return $item;
	}

	function createCountDom(count) {
		var count = count || 0;
		return $('<span class="count">'+count+'</span>');
	}

	function createRemoveDom(callback) {
    	var $remove = $('<i class="fa fa-times-circle delete-button"></i>');
    	$remove.click(callback);		
    	return $remove;
	}

});