function GetSortableListTemplate(translationCallback, addButtonLabel, iconIconFileEnding)
{

	var sortableListDefaultPager = "<div class='pagination-centered'>" +
		"<div data-bind='text: \" "+translationCallback("[[[Displaying]]]")+" \" + ($root.TotalItemCount() == 0 ? 0 : ($root.CurrentPage()*$root.ItemsPerPage()-$root.ItemsPerPage()+1)) + \" - \" + ($root.CurrentPage()*$root.ItemsPerPage() > $root.TotalItemCount() ? $root.TotalItemCount() : $root.CurrentPage()*$root.ItemsPerPage()) + \" "+translationCallback("[[[of///displaying 10-20 OF 40 results]]]")+" \" + $root.TotalItemCount() + \" "+translationCallback("[[[total results.]]]")+"\"'>" +
			"</div><ul class='pagination'>" +
			"<li class='arrow reload-on-dom-insert' data-bind='click: $root.prevPage, css: { unavailable: $root.CurrentPage() <= 1 }'><a href=''>&laquo; "+translationCallback("[[[Prev]]]")+"</a></li>" +
			"<!-- ko foreach: pages -->" +
			"<!-- ko if: (pageNr == 1 && $root.CurrentPage() >= 4 && Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) > 5)  -->" +
			"<li class='pagenum' data-bind='click: $root.changePage'><a href='' data-bind='text: (pageNr+\"...\")'></a></li>" +
			"<!-- /ko -->" +
			"<!-- ko if: (pageNr > $root.CurrentPage() - 3 && pageNr < $root.CurrentPage() + 3) || (pageNr <= 5 && $root.CurrentPage() <= 3) || (pageNr >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage())-3 && $root.CurrentPage() >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage())-2)  -->" +
			"<li class='pagenum' data-bind='click: $root.changePage, css: { current: $root.CurrentPage() == pageNr }'><a href='#' data-bind='text: pageNr'></a></li>" +
			"<!-- /ko -->" +
			"<!-- ko if: (pageNr == Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) && $root.CurrentPage() <= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage())-3) && Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) > 5  -->" +
			"<li class='pagenum' data-bind='click: $root.changePage'><a href='' data-bind='text: (\"...\"+pageNr)'></a></li>" +
			"<!-- /ko -->" +
			"<!-- /ko -->" +
			//"<li class='arrow reload-on-dom-insert' data-bind='click: $root.nextPage, css: { inactive: $root.CurrentPage() >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) }'><a href=''>"+translationCallback("[[[Next]]]")+" &raquo;</a></li>" +
			"<li class='arrow reload-on-dom-insert' data-bind='click: $root.nextPage, css: { unavailable: $root.CurrentPage() >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) }'><a href=''>"+translationCallback("[[[Next]]]")+" &raquo;</a></li>" +
			"</ul></div>";
					
					
	var sortableListTemplate =
		//"<div class='filter'>" +
		//    "<input type='text' data-bind='value: searchText, valueUpdate: \"input\", event: {keyup: $root.search}' placeholder='"+translationCallback("[[[filter]]]")+"' />" +
		//"</div>" +
		"<div>" +
			"<div class='header'>" +
				"<h2 data-bind='text: Title' class='small-12 medium-6 columns'>" +
				"</h2>" +
				"<div class='helper small-12 medium-6 columns'>" +
					"<div class='helperActions right'>" +
						"<!-- ko if:HelpText().length > 0 -->" +
							"<div class='list-tooltip reload-on-dom-insert' data-bind='tooltip: { content: HelpText() }'>" +
								"<img data-bind='attr { src: ($root.GetContentPath() + \"Info."+iconIconFileEnding+"\" ) }' />" +
							"</div>" +
						"<!-- /ko -->" +
						"<!-- ko if:AddAllowed() -->" +
								"<button class='button execute right reload-on-dom-insert' data-bind='visible:AddAllowed(), attr: { href: AddUrl() != null && AddUrl().length > 0 ? AddUrl() : \"#\" }, click: function(data, event) { return $root.addClick(data, event, $parents) }'>" +
									addButtonLabel +
								"</button>" +
						"<!-- /ko -->" +
					 "</div>" +
					 "<div class='filter right'>" +
						// TODO: valueUpdate: "afterkeydown" works in IE9-, but also triggers on shift, alt and so on. Once IE9 support is dropped, change to "input" instead, that only responds to actual changes
						"<input class='reload-on-dom-insert' type='text' data-bind='value: searchText, valueUpdate: \"afterkeydown\", event: {keyup: $root.search}' placeholder='"+translationCallback("[[[filter]]]")+"' />" +
					"</div>" +
				"</div>"+
			"</div>" +
			
			//"<!-- ko if:HelpText().length > 0 -->" +
			//    "<div class='list-tooltip' data-bind='tooltip: { content: HelpText() }'>" +
			//        "<img src='/Content/Images/icons/Info.png'>" + 
			//    "</div>" +
			//"<!-- /ko -->" +
			"<table>" +
				"<thead>" +
					"<!-- ko if: Columns().length > 0 -->" +
						"<tr data-bind='foreach: Columns'>" +
							"<td data-bind='css: { ActiveSorting: $root.SortedBy() == SortName(), Desc: $root.SortedDescending(), FoldChildren: ($context.$index() > 0)}'>" +
								"<!-- ko if: Sortable -->" +
									"<a data-bind='click: $root.resort, clickBubble: false'>" +
										"<span data-bind='text: Label'>" +
										"</span>" +
									"</a>" +
								"<!-- /ko -->" +
								"<!-- ko ifnot: Sortable -->" +
									"<span data-bind='text: Label'>" +
									"</span>" +
								"<!-- /ko -->" +
							"</td>" +


							"<!-- ko if: $root.HideActionsColumn() == false && $parent.Columns().length == ($index()+1) -->" +
									"<td class='listActions' data-bind='css: { \"listFold\": ($root.isFullSize() == false) }'>" +
										"<span data-bind='html: $root.actionText'></span>" +
									"</td>" +
								"<!-- /ko -->" +
							"<!-- /ko -->" +
						"</tr>" +
					"<!-- /ko -->" +
				"</thead>" +
				"<tbody data-bind='foreach: Rows'>" +
					"<!-- ko ifnot:Hidden() -->" +
						"<tr class='FoldBase' data-bind='foreach: Cells, css: { \"even\": ($index() % 2 == 0) }, attr: { \"data-id\":Id }, click: function(data, event) { return $root.itemClick(data, event, $parents, true) }'>" +

							"<!-- ko if:Type() == 'Checkbox' -->" +
							"<td data-bind='css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
								"<input type='checkbox' data-bind='attr: { \"data-id\": Id, \"data-actionName\": ActionName}, checked: Checked(), click: function(data, event) { return $root.checkboxClick(data, event, $parents) }, clickBubble: false'></input>" +
							"</td>" +
							"<!-- /ko -->" +

							"<!-- ko if:Type() == 'ChildCollection' -->" +
								"<td data-bind='foreach:Children, css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
									"<!-- ko if:Interactive -->" +
										"<a data-bind='text:Label, attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\" }, click: function(data, event) { return $root.itemClick(data, event, $parents, false) }'>" +
										"</a>" +
									"<!-- /ko -->" +
									"<!-- ko ifnot:Interactive -->" +
										"<span data-bind='text:Label, attr: { \"class\": CssClasses() }'>" +
										"</span>" +
									"<!-- /ko -->" +
								"</td>" +
							"<!-- /ko -->" +
							
							"<!-- ko if:Type() == 'Html' -->" +
								"<!-- ko ifnot:Interactive() -->" +
									"<td data-bind='html:Html, css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
									"</td>" +
								"<!-- /ko -->" +
								"<!-- ko if:Interactive() -->" +
									"<td data-bind='css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
										"<a data-bind='html:Html, attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", target: OpenUrlNewWindow() == true ? \"_blank\" : \"_self\"  }, click: function(data, event) { return $root.itemClick(data, event, $parents, false) }, clickBubble: false'>" +
										"</a>" +
									"</td>" +
								"<!-- /ko -->" +
                            "<!-- /ko -->" +
							
							"<!-- ko if:Type() == 'Label' -->" +
								"<!-- ko ifnot:Interactive() -->" +
									"<td data-bind='text:Label, css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
									"</td>" +
								"<!-- /ko -->" +
								"<!-- ko if:Interactive() -->" +
									"<td data-bind='css: { \"FoldChildren\": ($context.$index() > 0) }, attr: {\"data-heading\": $root.Columns()[$index()].Label(), \"class\": CssClasses() }'>" +
										"<a data-bind='text:Label, attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", target: OpenUrlNewWindow() == true ? \"_blank\" : \"_self\"  }, click: function(data, event) { return $root.itemClick(data, event, $parents, false) }, clickBubble: false'>" +
										"</a>" +
									"</td>" +
								"<!-- /ko -->" +
							"<!-- /ko -->" +
							"<!-- ko if: $parent.Cells().length == ($index()+1) -->" +

								"<!-- ko if: $root.HideActionsColumn() == false -->" +
									"<td class='listActions FoldChildren' data-bind='attr: {\"data-heading\": \""+translationCallback("[[[Actions]]]")+"\"}'>" +
										"<!-- ko foreach: $parent.ActionGroups -->" +
											"<span class='action-group'>" +
												"<!-- ko foreach: Actions() -->" +
													"<a class='action' data-bind='attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", title: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description) }, click: function(data, event) { return $root.actionClick(data, event, $parents) }, clickBubble: false'>" +
														"<!-- ko if: IsTextLabel() == false -->" +
															"<img data-bind='attr { src: ($root.GetContentPath() + Type() + (Toggled() ? \"-toggled\" : \"\") + (Disabled() ? \"-disabled\" : \"\") + \"."+iconIconFileEnding+"\"), class: (Disabled() ? Type() +  \" disabled\" : Type()), alt: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description)  }' />" +
														"<!-- /ko -->" +
														"<!-- ko if: IsTextLabel() -->" +
															"<span data-bind='text: Type()'>" +
															"</span>" +
														"<!-- /ko -->" +
													"</a>" +
												"<!-- /ko -->" +
											"</span>" +
										"<!-- /ko -->" +

										"<!-- ko foreach: $parent.Actions -->" +
											"<a class='action' data-bind='attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", title: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description) }, click: function(data, event) { return $root.actionClick(data, event, $parents) }, clickBubble: false'>" +
												"<!-- ko if: IsTextLabel() == false -->" +
													"<img data-bind='attr: { src: ($root.GetContentPath() + Type() + (Toggled() ? \"-toggled\" : \"\") + (Disabled() ? \"-disabled\" : \"\") + \"."+iconIconFileEnding+"\"), class: (Disabled() ? Type() +  \" disabled\" : Type()), alt: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description)  }' />" +
												"<!-- /ko -->" +
												"<!-- ko if: IsTextLabel() -->" +
													"<span data-bind='text: Type()'>" +
													"</span>" +
												"<!-- /ko -->" +
											"</a>" +
										"<!-- /ko -->" +
									"</td>" +
								"<!-- /ko -->" +


								"<td class='toggleControl' data-bind='attr: {\"data-heading\": \"ToggleControl\"}'>" +
									"<div class='toggleListFold' data-bind='click: $root.toggleFolding'>" +
										"<span class='cavet'>" +
										"</span>" +
									"</div>" +
								"</td>" +

							"<!-- /ko -->" +
						"</tr>" +
					"<!-- /ko -->" +
				"</tbody>" +
			"</table>" +
		"</div>" +
		sortableListDefaultPager;
	
	
		return sortableListTemplate;
}