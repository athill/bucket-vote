'use strict';
$(function() {
	var $committee = $('#committee'),
		$prospects = $('#prospects'),
		$nameField = $('#add-prospect'),
		mappings = {},
		memberlimit = 10;

	//// load mappings
	$.getJSON('/data/mappings.json', function(data) {
		mappings = data;
	});

	//// load buckets
	$.getJSON('/data/committee.json', function(data) {
		data.forEach(function(member) {
			var $memberprospects = $('<div class="member-prospects"></div>'),
				$member = createMemberDom(member);
			$memberprospects.droppable({
			    drop: handleProspectDrop
			});
			$member.append($memberprospects);			
			$committee.append($member);
		});
	});
	//// load items
	$.getJSON('/data/prospects.json', function(data) {
		data.forEach(function(prospect) {
			var $prospect = createProspectDom(prospect),
				$count = createCountDom(),
				$remove = createRemoveDom(removeProspectFromProspects);
			$prospect.append($count)
				.append($remove);
			$prospects.append($prospect);
		});
		sortProspects();
		
	});
	//// load mappings
	$.getJSON('/data/mappings.json', function(data) {
		for (var member in data) {
			var $member = $('#'+getId(member)+'-member');
			data[member].forEach(function(name) {
				var $prospect = createProspectDom(name),
					$remove = createRemoveDom(removeProspectFromMember);
				$prospect.append($remove);
				addProspectToMemberDom($member, $prospect);
			});
		}
	});
	//// add new prospect
	$('#add-prospect-form').submit(function(e) {
		e.preventDefault();
		var name = $nameField.val().trim(),
			add = true;
		//// empty name
		if (name === '') {
			alert('Please supply a name');
			add = false;
		} else {
			//// name already exists
			$prospects.children().each(function(i) {
				var currentname = $(this).find('.name').text().trim();
				if (name === currentname) {
					alert(name + ' is already a prospect');
					add = false;
					return false;
				}
			});
		}
		if (add) {
			addToProspects(name);
		}
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

	function createMemberDom(memberName) {
		return $('<div class="member" id="'+getId(memberName)+'-member">'+
					'<header>'+
						'<span class="name">'+memberName+'</span>'+
						'<span class="count">0</span>'+
					'</header>'+
				'</div>');
	}

	function createProspectDom(prospectName) {
		var $prospect = $('<div id="'+getId(prospectName)+'-prospect" class="prospect">'+
							'<span class="name">'+prospectName+'</span>'+
						'</div>');
		$prospect.draggable({
		    helper:"clone"
		});
		return $prospect;
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

	function removeProspectFromProspects(e) {
		var $parent = $(this).parent(),
			name = $parent.find('.name').text(),
			data = {
				action: 'delete-from-prospects',
				prospect: name
			},
			success = function(data) {
				$parent.remove();
				$committee.find('.member-prospects').each(function(i) {
					$(this).find('.prospect').each(function(j) {
						if ($(this).find('.name').text() === name) {
							var $member = $(this).closest('.member');
							removeProspectFromMemberDom($member, $(this));
						}
					});
				});
			};
		updateData(data, success);
	}

	function removeProspectFromMember(e) {
		var $prospect = $(this).parent(),
			$member = $prospect.closest('.member'),
			data = {
				action: 'delete-from-member-bucket',
				member: $member.find('header .name').text(),
				prospect: $prospect.find('.name').text()

			},
			success = function(data) {
				removeProspectFromMemberDom($member, $prospect);	
			};
		updateData(data, success);
	}

	function removeProspectFromMemberDom($member, $prospect) {
		var name = $prospect.find('.name').text(),
			id = getId(name),
			$original = $('#'+id+'-prospect');
		if ($original.length > 0) {
			decrement($original.find('.count'));	
		}
		decrement($member.find('header .count'));
		$prospect.remove();			
	}

	function addProspectToMemberDom($member, $prospect) {
        var id = getId($prospect.find('.name').text()),
        	$original = $('#'+id+'-prospect'),
        	$remove = $prospect.find('.delete-button'),
        	$membercount = $member.find('header .count'),
        	$prospectcount = $original.find('.count');
    	$prospect.removeAttr('id')
    		.css({'cursor': 'auto'})
    		.find('.count').remove();
    	//// change click handler for delete button
    	$remove.off('click')
    		.click(removeProspectFromMember);
    	//// add clone to prospects
        $member.find('.member-prospects').append($prospect);
        //// increment parent count
        increment($membercount);
        //// increment prospect count
        increment($prospectcount);
	}
	function getId(name) {
		return name.toLowerCase().replace(/ /, '-');
	}
	function sortProspects() {
		var $children = $prospects.children();
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
		$children.detach().appendTo($prospects);
	}

	function handleProspectDrop(e, ui) {
    	var $draggable = $(ui.draggable),
    		$parent = $(this).parent(),
    		$children = $(this).children(),
    		add = true,
    		prospect = $draggable.find('.name').text(),
    		member = $parent.find('header .name').text();
    	//// check length
    	if ($children.length == memberlimit) {
    		alert(member +' already has '+memberlimit+' prospects');
    		add = false;
    	} else {
    		//// check duplicates
	    	$children.each(function(i) {
	    		if ($(this).find('.name').text() === prospect) {
	    			alert(prospect + ' is already in the list for '+member);
	    			add = false;
	    			return false;
	    		}
	    	});			    		
    	}
    	if (add) {
    		var data = {
	    			action: 'add-to-member-bucket',
	    			member: member,
	    			prospect: prospect
	    		},
    			success = function(data) {
		    		//// clone object
			    	var $clone = $draggable.clone();
			        addProspectToMemberDom($parent, $clone);

			    };
		    updateData(data, success);		    		

    	}
    }

    function addToProspects(name) {
		var data = {
			action: 'add-to-prospects',
			prospect: name
		};
		var success = function(data) {
			var $prospect = createProspectDom(name),
				$remove = createRemoveDom(removeProspectFromProspects),
				$count = createCountDom();
			$prospect.append($count);
			$prospect.append($remove);
			$prospects.append($prospect);
			sortProspects();
			$nameField.val('');				
		}
		updateData(data, success);    	
    }


});