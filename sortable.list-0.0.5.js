
//contains all lists on a page, there can be several lists on one page and they will all work independently
var SortableLists = new Array();

// Allows us to look up a specific sortable list by the element it's attached to, by calling SortableLists.getByContainer($("#MyListTarget"));
// The same can be achieved by calling $("#MyListTarget").getListModel();
SortableLists.getByContainer = function (container) {
    for (i = 0; i < this.length; i++) {
        if (this[i].GetContainer() == container || (container.hasOwnProperty("length") && container.length > 0 && this[i].GetContainer() == container[0]))
            return this[i];
    }
}

//The class that manages a list, an instance maintains all data and functionality for a list.
function SortableList() {
    var sortableListSelf = this;
    var ServerUrl;
    var model;
    var ajaxCall = null;
    var searchTypeTimeout = null;
    var Container;
    var Id;
    var ContentPath = "/";
	var _template; //added later, better with _ for global vars.. might update the rest at some point

	
	
    var Settings = {};

    //These are sent in to the server when there is a call
    var sortName = "";
    var sortDescending = false;
    var searchText = "";
    var page = 1;

    sortableListSelf.GetModel = function() {
        return model;
    };

    sortableListSelf.GetContainer = function() {
        return Container;
    };

    sortableListSelf.GetId = function(){
        return Id;
    };

    sortableListSelf.GetContentPath = function () {
    	return ContentPath;
    };

	sortableListSelf.t = function(src)
	{
		//If string does not start with "[[[", we assume i18n plugin has been used and it is already translated
		if(this.indexOf("[["+"[") != 0) //split so not found by i18n
		{
			return src;	
		}
		
		
		//There must be an end of nugget, if there is not we just return src
		var endIndex = src.indexOf("]]"+"]"); //split so not found by i18n
		if(endIndex === -1)
		{
			return src;
		}
		
		//If we have a comment, that actually ends our actual string
		var nuggetComment = src.indexOf("///");
		if(nuggetComment >= 0 && nuggetComment < endIndex)
		{
			endIndex = nuggetComment;
		}
		
		//If we have paramters, that actually ends our actual string
		//Since however does not really work correctly for parameters as there is no parameter insertion, so this would need to be exmpanded for parameters to work
		var nuggetParameters = src.indexOf("|||");
		if(nuggetParameters >= 0 && nuggetParameters < endIndex)
		{
			endIndex = nuggetParameters;
		}
		
		
		//Get the actual string
		var parsedSource = src.substring(3, endIndex);
		
		//We don't have our translation so we can't translate, we return the parsed result without [[[]]]
		if(typeof(sortableListLang) == 'undefined' || sortableListLang == null)
		{
			return parsedSource;
		}
		
		for (var i = 0; i < sortableListLang.length; i++) {
			
			if(sortableListLang[i].key === parsedSource)
			{
				return sortableListLang[i].value;
			}
			
		}
		
		//Translation not found, we return the parsed result without [[[]]]
		return parsedSource;
	}

    sortableListSelf.CreateSortableList = function (containerElement, url, template, contentPath, id, settings) {
        Container = containerElement;
        ServerUrl = url;

        // Lets see if the url is a javascript function reference. If it is, execute it to get the Url.
        if (getFunctionFromString(url)) {
            ServerUrl = getFunctionFromString(url)(this);
        }

        Id = id;
        ContentPath = contentPath;

        if (settings != null)
            Settings = settings;

        _template = template;
	     sortableListSelf.insertListHtml(_template);
        sortableListSelf.fetchDataSet(function (data) {
            model = new sortableListSelf.ListViewModel(data);
            ko.applyBindings(model, Container);
        });
    };

	//should never be needed normally but sometimes the list can bug out from dom detatch/reattach and then it's called from reset function
	sortableListSelf.clearListHtml = function() {

		//We allow custom lists so if there is html we do not overwrite it.
		$(Container).html("");
	};

	sortableListSelf.insertListHtml = function (template) {

        //We allow custom lists so if there is html we do not overwrite it.
        if ($(Container).html().trim().length > 0) {
            return;
        }


        var html = "";


        var defaultPager = "<div class='pagination-centered'>" +
            "<div data-bind='text: \" "+sortableListSelf.t("[[[Displaying]]]")+" \" + ($root.TotalItemCount() == 0 ? 0 : ($root.CurrentPage()*$root.ItemsPerPage()-$root.ItemsPerPage()+1)) + \" - \" + ($root.CurrentPage()*$root.ItemsPerPage() > $root.TotalItemCount() ? $root.TotalItemCount() : $root.CurrentPage()*$root.ItemsPerPage()) + \" "+sortableListSelf.t("[[[of///displaying 10-20 OF 40 results]]]")+" \" + $root.TotalItemCount() + \" "+sortableListSelf.t("[[[total results.]]]")+"\"'>" +
                "</div><ul class='pagination'>" +
                "<li class='arrow reload-on-dom-insert' data-bind='click: $root.prevPage, css: { unavailable: $root.CurrentPage() <= 1 }'><a href=''>&laquo; "+sortableListSelf.t("[[[Prev]]]")+"</a></li>" +
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
                //"<li class='arrow reload-on-dom-insert' data-bind='click: $root.nextPage, css: { inactive: $root.CurrentPage() >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) }'><a href=''>"+sortableListSelf.t("[[[Next]]]")+" &raquo;</a></li>" +
                "<li class='arrow reload-on-dom-insert' data-bind='click: $root.nextPage, css: { unavailable: $root.CurrentPage() >= Math.ceil($root.TotalItemCount()/$root.ItemsPerPage()) }'><a href=''>"+sortableListSelf.t("[[[Next]]]")+" &raquo;</a></li>" +
                "</ul></div>";


        //default template
        if (typeof template == 'undefined' || template == null || template.length == 0) {
            var addButtonLabel = t("[[[Add new]]]");
            if (Settings != null && Settings.hasOwnProperty("add-label"))
                addButtonLabel = Settings["add-label"];

            html +=
                //"<div class='filter'>" +
                //    "<input type='text' data-bind='value: searchText, valueUpdate: \"input\", event: {keyup: $root.search}' placeholder='"+sortableListSelf.t("[[[filter]]]")+"' />" +
                //"</div>" +
                "<div>" +
                    "<div class='header'>" +
                        "<h2 data-bind='text: Title' class='small-11 medium-10 large-12 columns'>" +
                        "</h2>" +
                        "<div class='helper'>" +
                            "<div class='helperActions small-12 medium-2 large-3 large-push-9 columns'>" +
                                "<!-- ko if:HelpText().length > 0 -->" +
                                    "<div class='list-tooltip reload-on-dom-insert' data-bind='tooltip: { content: HelpText() }'>" +
                                        "<img data-bind='attr { src: ($root.GetContentPath() + \"Info2.svg\" ) }' />" +
                                    "</div>" +
                                "<!-- /ko -->" +
                                "<!-- ko if:AddAllowed() -->" +
                                        "<button class='button reload-on-dom-insert' data-bind='visible:AddAllowed(), attr: { href: AddUrl() != null && AddUrl().length > 0 ? AddUrl() : \"#\" }, click: function(data, event) { return $root.addClick(data, event, $parents) }'>" +
                                            addButtonLabel +
                                        "</button>" +
                                "<!-- /ko -->" +
                             "</div>" +
                             "<div class='filter small-12 large-9 large-pull-3 columns'>" +
                                // TODO: valueUpdate: "afterkeydown" works in IE9-, but also triggers on shift, alt and so on. Once IE9 support is dropped, change to "input" instead, that only responds to actual changes
                                "<input class='reload-on-dom-insert' type='text' data-bind='value: searchText, valueUpdate: \"afterkeydown\", event: {keyup: $root.search}' placeholder='"+sortableListSelf.t("[[[filter]]]")+"' />" +
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
									"<!-- ko if:Children().length > 0 -->" +
										"<td data-bind='foreach:Children, css:  $root.combineCss({ \"FoldChildren\": ($context.$index() > 0) }, CssClasses()), attr: {\"data-heading\": $root.Columns()[$index()].Label()}'>" +
											"<!-- ko if:Interactive -->" +
												"<a data-bind='text:Label, attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\" }, click: function(data, event) { return $root.itemClick(data, event, $parents, false) }'>" +
												"</a>" +
											"<!-- /ko -->" +
											"<!-- ko ifnot:Interactive -->" +
												"<span data-bind='text:Label'>" +
												"</span>" +
											"<!-- /ko -->" +
										"</td>" +
									"<!-- /ko -->" +
									"<!-- ko if:Children().length == 0 -->" +
										"<!-- ko ifnot:Interactive() -->" +
											"<td data-bind='css: $root.combineCss({ \"FoldChildren\": ($context.$index() > 0) }, CssClasses()), attr: {\"data-heading\": $root.Columns()[$index()].Label() }'>" +
                                            "<span data-bind='text: Label' class='listLabel'>" +
                                            "</span>" +
                                            "<!-- ko if: LabelDescription -->" +
                                                    "<span data-bind='text: LabelDescription' class='listLabelDescription'>" +
                                                    "</span>" +
                                                "<!-- /ko -->" +
											"</td>" +
										"<!-- /ko -->" +
										"<!-- ko if:Interactive() -->" +
											"<td data-bind='css:  $root.combineCss({ \"FoldChildren\": ($context.$index() > 0) }, CssClasses()), attr: {\"data-heading\": $root.Columns()[$index()].Label() }'>" +
												"<a data-bind='text:Label, attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", target: OpenUrlNewWindow() == true ? \"_blank\" : \"_self\"  }, click: function(data, event) { return $root.itemClick(data, event, $parents, false) }, clickBubble: false' class='listLabel'>" +
												"</a>" +
                                                "<!-- ko if: LabelDescription -->" +
                                                    "<span data-bind='text: LabelDescription' class='listLabelDescription'>" +
                                                    "</span>" +
                                                "<!-- /ko -->" +
											"</td>" +
										"<!-- /ko -->" +
									"<!-- /ko -->" +
									"<!-- ko if: $parent.Cells().length == ($index()+1) -->" +

										"<!-- ko if: $root.HideActionsColumn() == false -->" +
											"<td class='listActions FoldChildren' data-bind='attr: {\"data-heading\": \""+sortableListSelf.t("[[[Actions]]]")+"\"}'>" +
												"<!-- ko foreach: $parent.ActionGroups -->" +
													"<span class='action-group'>" +
														"<!-- ko foreach: Actions() -->" +
															"<a class='action' data-bind='attr: { href: Url() != null && Url().length > 0 ? Url() : \"#\", title: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description) }, click: function(data, event) { return $root.actionClick(data, event, $parents) }, clickBubble: false'>" +
																"<!-- ko if: IsTextLabel() == false -->" +
																	"<img data-bind='attr { src: ($root.GetContentPath() + Type() + (Toggled() ? \"-toggled\" : \"\") + (Disabled() ? \"-disabled\" : \"\") + \".svg\"), class: (Disabled() ? Type() +  \" disabled\" : Type()), alt: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description)  }' />" +
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
															"<img data-bind='attr { src: ($root.GetContentPath() + Type() + (Toggled() ? \"-toggled\" : \"\") + (Disabled() ? \"-disabled\" : \"\") + \".svg\"), class: (Disabled() ? Type() +  \" disabled\" : Type()), alt: (Toggled() && ToggledDescription() != \"\" ? ToggledDescription : Description)  }' />" +
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
                defaultPager;

        }
        else if (template == "slim") {

            //this is currently only a placeholder to show that you can have different layouts
            html +=
                "<div>" +
                "Kalle" +
                "</div>";
        }



        


        $(Container).html(html);

    };

    sortableListSelf.fetchDataSet = function (done) {

        //If we want new data we want to cancel any current requests
        if (ajaxCall != null) {
            ajaxCall.abort();
            ajaxCall = null;
        }

        $(Container).block({ message: $(".loading-anim").html() });

        ajaxCall = $.ajax({
                type: "POST",
                url: ServerUrl,
                dataType: "json",
                data: { SortName: sortName, SortDescending: sortDescending, SearchText: searchText, Page: page }
            })
            .done(function (data) {

            	ajaxCall = null;
                $(Container).unblock();

                done(data);
            })
            .fail(function () {
            	ajaxCall = null;
            	$(Container).block({ message: '<div class="blockui-info-box">'+sortableListSelf.t("[[[Something went wrong. Try again and if the error remains please contact the system administrator.]]]")+' <a href="#" onclick="afterFailure(' + Id + '); return false;">'+sortableListSelf.t("[[[Ok]]]")+'</a></div>' });
            });
    };

    sortableListSelf.PagingModel = function() {
        selfPager = this;

        selfPager.pageNr = ko.observable();
        selfPager.active = ko.observable();
    };



    sortableListSelf.ListViewModel = function (data) {
        var selfModel = this;
        selfModel.searchText = ko.observable();
        selfModel.pages = ko.observableArray();



        selfModel.getActionText = function () {
            return selfModel.isFullSize() ? t("[[[Actions]]]") : "<em>"+sortableListSelf.t("[[[Click to fold down options]]]")+"</em>";
        }


        selfModel.getIsFullSize = function () {
            //should return true if we want full sized version, false if we want small cell phone version


            if (typeof Foundation != 'undefined' && typeof Foundation.media_queries != "undefined") { //we have foundation
                return matchMedia(Foundation.media_queries['large']).matches;
            }

            //last resort we always force it to full size
            return true;

        };


        selfModel.isFullSize = ko.observable(selfModel.getIsFullSize());
        selfModel.actionText = ko.observable(selfModel.getActionText());

        $(window).resize(function () {
            // Update the isFullSize and actionText observables on window resize
            selfModel.actionText(selfModel.getActionText());
            selfModel.isFullSize(selfModel.getIsFullSize());
        });


        //Apart from the set model properties above we also populate the model with data from the server

        selfModel.GetContentPath = function () {
        	return sortableListSelf.GetContentPath();
        };


        selfModel.resort = function (resortData, event) {
            if (resortData.Sortable()) {

                //default to ascending
                var descending = false;

                //We are sorting on the same column as last time, which means we want to sort the other way from current sort order
                if (selfModel.SortedBy() == resortData.SortName()) {
                    descending = selfModel.SortedDescending() == false ? true : false;
                }

                sortName = resortData.SortName();
                sortDescending = descending;

                selfModel.FetchAndUpdate();
            }
        };

        selfModel.search = function (resortData, event) {

            if (event.keyCode >= 16 && event.keyCode <= 18 && event.keyCode >= 37 && event.keyCode <= 40) {
                return; // Filters out Shift, Ctrl, Alt and arrow keys TODO: Remove once we change to "input" as event trigger
            }
 
            //we only search when we have typed more than two characters
            if (selfModel.searchText().length > 2) {
                searchText = selfModel.searchText();
            }
            else {
                //empty the search text when we have not typed enough to search
                searchText = "";
            }

            //always jump to first page whenever we search
            page = 1;

            //We want time of wait before searching (if you type quickly) so if there is a timeout running we cancel it and start a new timeout
            if (searchTypeTimeout != null) {
                clearTimeout(searchTypeTimeout);
            }

            setTimeout(function() { selfModel.FetchAndUpdate(); }, 500);
        };

        selfModel.toggleFolding = function (itemData, event) {
            var clickedElement = event.target;

            if ($(clickedElement).closest(".FoldBase").hasClass("foldedOut")) {
                $(clickedElement).closest(".FoldBase").removeClass("foldedOut");
                $(clickedElement).closest(".FoldBase").find(".FoldChildren").removeClass('opened');
                $(clickedElement).closest(".FoldBase").find(".FoldChildren").each(function () {

                    $(this).find("h6").remove();
                });
                
            } else {
                $(clickedElement).closest(".FoldBase").addClass("foldedOut");
                $(clickedElement).closest(".FoldBase").find(".FoldChildren").addClass('opened');
                $(clickedElement).closest(".FoldBase").find(".FoldChildren").each(function () {

                        var dataHeading = $(this).data("heading");

                        $(this).prepend("<h6>" + dataHeading + "</h6>");
                    });
                
            }
        };

        selfModel.combineCss = function (cssObj1, cssObj2) {
            return jQuery.extend({}, cssObj1, cssObj2);
        }

        selfModel.itemClick = function (itemData, event, parents, highlightElement) {


            //we want to stop the event bubbling and then send out our own event
            event.stopImmediatePropagation();

            //If the url is set we simply follow it.
            if (typeof itemData.Url == 'function' && typeof itemData.Url() != 'undefined' && itemData.Url() != null && itemData.Url().length > 0)
            {
            	return true;
            	//window.location = itemData.Url();
            }

            var typeOfChild = "Item";

            if (typeof parents[1] != 'undefined') {
                //todo: child has not been implemented, it is meant to be own rows of children.
                typeOfChild = "Child";
                if (typeof parents[0].Children == 'function' && typeof parents[0].Children() != 'undefined' && parents[0].Children() != null && parents[0].Children().length > 0) {
                    typeOfChild = "ColumnChild";
                }
            }

            var idCollection = new Array();

            if (typeof itemData.Id == 'function' && typeof itemData.Id() != 'undefined' && itemData.Id() != null && itemData.Id().length > 0) {
                idCollection.push(itemData.Id());
            }
            

            for(var currentParent in parents)
            {
            	if (typeof parents[currentParent] != 'undefined' && typeof parents[currentParent].Id == 'function' && typeof parents[currentParent].Id() != 'undefined' && parents[currentParent].Id() != null && parents[currentParent].Id().length > 0 && parents.hasOwnProperty(currentParent)) {
            		idCollection.push(parents[currentParent].Id());
                }
            }

            if (highlightElement) {
                $(Container).find(".lastClickedElement").removeClass("lastClickedElement");
                $(event.currentTarget).addClass("lastClickedElement");
            }

            //type can be Item, Child or ColumnChild where ColumnChild means it's a summary list in a column, Child means it's a child row and item is a top level item clicked
            //idCollection contains clicked items id as well as ancestors. index 0 is the clicked id, index 1 is parent, 2 is grandparent and so on.
            //action contains the type of action that war requested. In this case it's a normal click/select but it could be "delete", "edit" or anything else the server has provided as option
            //the model contains the entire model for this list
            $(Container).trigger("sortableListAction", { type: typeOfChild, action:"select", idCollection: idCollection, model:model, event:event });
        };

        selfModel.addClick = function (itemData, event, parents) {

            //If the url is set we simply follow it.
        	if (typeof itemData.AddUrl == 'function' && typeof itemData.AddUrl() != 'undefined' && itemData.AddUrl() != null && itemData.AddUrl().length > 0) {
        		window.location = itemData.AddUrl();
                //return true;
            }

            var typeOfChild = "Item";

            var idCollection = new Array();

            if (typeof itemData.Id == 'function' && typeof itemData.Id() != 'undefined' && itemData.Id() != null && itemData.Id().length > 0) {
                idCollection.push(itemData.Id());
            }


            for (var currentParent in parents) {
            	if (typeof parents[currentParent] != 'undefined' && typeof parents[currentParent].Id == 'function' && typeof parents[currentParent].Id() != 'undefined' && parents[currentParent].Id() != null && parents[currentParent].Id().length > 0 && parents.hasOwnProperty(currentParent)) {
            		idCollection.push(parents[currentParent].Id());
                }
            }

            //type can be Item, Child or ColumnChild where ColumnChild means it's a summary list in a column, Child means it's a child row and item is a top level item clicked
            //idCollection contains clicked items id as well as ancestors. index 0 is the clicked id, index 1 is parent, 2 is grandparent and so on.
            //action contains the type of action that war requested. In this case it's a normal select (click) but it could be "delete", "edit" or anything else the server has provided as option
            //the model contains the entire model for this list
            $(Container).trigger("sortableListAction", { type: typeOfChild, action: "add", idCollection: idCollection, model: model, event: event });
        };

        selfModel.actionClick = function (actionData, event, parents) {

            //we are not allowed to interact with this action
            if (actionData.Disabled()) {
                return;
            }
            
			//We have to confirm this action
            if (typeof actionData.ConfirmText == 'function' && typeof actionData.ConfirmText() != 'undefined' && actionData.ConfirmText() != null && actionData.ConfirmText() != "") {
            	if (!confirm(actionData.ConfirmText())) {
		            return;
	            }
	        }

	        var itemId = null;

            for (var currentParent in parents) {
            	if (typeof parents[currentParent] != 'undefined' && typeof parents[currentParent].Id == 'function' && typeof parents[currentParent].Id() != 'undefined' && parents[currentParent].Id() != null && parents[currentParent].Id().length > 0 && parents.hasOwnProperty(currentParent)) {
            		itemId = parents[currentParent].Id();
                    break;
                }
            }

            //We did not find which id we want to perform an action on
            if (itemId == null) {
                return;
            }

            var idCollection = new Array();
            idCollection.push(itemId);
            var typeOfChild = "Item";

            //The url is set
            if (typeof actionData.Url == 'function' && typeof actionData.Url() != 'undefined' && actionData.Url() != null && actionData.Url().length > 0) {

                //We want to action the url with ajax
                if (actionData.ExecuteAsAjax() == true) {
                    
                    $(Container).block({ message: $(".loading-anim").html() });
                	//$(Container).block({ message: '<div class="blockui-info-box">'+sortableListSelf.t("[[[Loading]]]")+'</div>' });

                    ajaxCall = $.ajax({
                        type: "POST",
                        url: actionData.Url(),
                        data: { id:itemId }
                    })
                    .done(function (data) {
                    	ajaxCall = null;

                    	if (data != null && data.hasOwnProperty("Data"))
                    	    data = data.Data;

                    	if ((data != null && typeof data.trim != "undefined" && data.trim() == "ok") || (data != null && data.hasOwnProperty("OperationSuccess") && data.OperationSuccess == true)) {
                    	    $(Container).unblock();

                    	    //we reload the data after action completes
                    	    selfModel.Reload();

                    	    $(Container).trigger("sortableListAction", { type: typeOfChild, action: actionData.Type() + "-ok", idCollection: idCollection, model: model, event: null });
                    	}
                    	else if (data != null && data.hasOwnProperty("OperationSuccess") && data.OperationSuccess == false && data.hasOwnProperty("OperationMessage")) {
                    	    // JSon-result with Success and OperationMessage (Json-serialized OperationResultModel-object). Something went wrong, and we have an error message to present
                    	    $(Container).block({ message: '<div class="blockui-info-box">' + data.OperationMessage + ' <a href="#" onclick="afterFailure(' + Id + '); return false;">'+sortableListSelf.t("[[[Ok]]]")+'</a></div>' });
	                    } else {
                    		$(Container).block({ message: '<div class="blockui-info-box">'+sortableListSelf.t("[[[Something went wrong. Try again and if the error remains please contact the system administrator.]]]")+' <a href="#" onclick="afterFailure(' + Id + '); return false;">'+sortableListSelf.t("[[[Ok]]]")+'</a></div>' });
	                    }

					})
                    .fail(function () {
                    	ajaxCall = null;
                    	$(Container).block({ message: '<div class="blockui-info-box">'+sortableListSelf.t("[[[Something went wrong. Try again and if the error remains please contact the system administrator.]]]")+' <a href="#" onclick="afterFailure(' + Id + '); return false;">'+sortableListSelf.t("[[[Ok]]]")+'</a></div>' });
                    });

	                return;

                } else {
                	//return true;
                	window.location = actionData.Url();
                }
            }


            //type can be Item, Child or ColumnChild where ColumnChild means it's a summary list in a column, Child means it's a child row and item is a top level item clicked
            //idCollection contains clicked items id as well as ancestors. index 0 is the clicked id, index 1 is parent, 2 is grandparent and so on.
            //action contains the type of action that war requested. In this case it's a normal select (click) but it could be "delete", "edit" or anything else the server has provided as option
            //the model contains the entire model for this list
            $(Container).trigger("sortableListAction", { type: typeOfChild, action: actionData.Type(), idCollection: idCollection, model: model, event: event });
        };

        //if url is not set, the current one is used
        selfModel.ResetAndReload = function (url) {

            if (typeof url != 'undefined' && url != null && url.length > 0) {
                ServerUrl = url;
            }

            selfModel.Reset();
            selfModel.Reload();
        };

        selfModel.Reset = function () {
            sortName = "";
            sortDescending = false;
            searchText = "";
            page = 1;
        };

    	//setting CompleteRedraw to true means wiping the table and completely redoing everything (except it keeps data such as page number)
    	//This should normally be avoided but in some cases the table simply bugs out after being detached and reattached from DOM
		//You have to be aware that using CompletelyRedraw means you need to remove all event listeners
        selfModel.Reload = function (CompleteRedraw) {

        	if (typeof CompleteRedraw != 'undefined' && CompleteRedraw) {

        		//complete reset
		        if ($(Container).find(".reload-on-dom-insert").length > 0) {
			        $(Container).find(".reload-on-dom-insert").each(function() {
				        ko.cleanNode(this);
			        });
		        }
		        ko.cleanNode(Container);
		        sortableListSelf.clearListHtml();
		        sortableListSelf.insertListHtml(_template);
        		sortableListSelf.fetchDataSet(function (data) {
        			model = new sortableListSelf.ListViewModel(data);
        			ko.applyBindings(model, Container);
        		});

        	} else {
				//normal update

        		selfModel.FetchAndUpdate();


        		//Some things like the add button and search field has to be reinitialised with event binding
        		//for some reason this is needed even after we completely clear the table on CompleteRedraw
        		if ($(Container).find(".reload-on-dom-insert").length > 0) {
        			$(Container).find(".reload-on-dom-insert").each(function () {
        				ko.cleanNode(this);
        				ko.applyBindingsToNode(this, null, model);
        			});
        		}
        	}



        };

        selfModel.ToggleDisabledAction = function (id, action) {
        	for (i = 0;i < selfModel.Rows().length; i++) {
        		if (selfModel.Rows()[i].Id() == id) {
        			for (j = 0; j < selfModel.Rows()[i].Actions().length; j++) {
        				if (selfModel.Rows()[i].Actions()[j].Type() == action) {
        					selfModel.Rows()[i].Actions()[j].Disabled(!selfModel.Rows()[i].Actions()[j].Disabled());
					        return selfModel.Rows()[i].Actions()[j].Disabled();
				        }
					}
					break;
				}    
	        }
        };
		
        selfModel.ToggleAction = function (id, action) {
        	for (i = 0; i < selfModel.Rows().length; i++) {
        		if (selfModel.Rows()[i].Id() == id) {
        			for (j = 0; j < selfModel.Rows()[i].Actions().length; j++) {
        				if (selfModel.Rows()[i].Actions()[j].Type() == action) {
        					selfModel.Rows()[i].Actions()[j].Toggled(!selfModel.Rows()[i].Actions()[j].Toggled());
        					return selfModel.Rows()[i].Actions()[j].Toggled();
        				}
        			}
        			break;
        		}
        	}
        };

        selfModel.IsActionToggled = function (id, action) {
        	for (i = 0; i < selfModel.Rows().length; i++) {
        		if (selfModel.Rows()[i].Id() == id) {
        			for (j = 0; j < selfModel.Rows()[i].Actions().length; j++) {
        				if (selfModel.Rows()[i].Actions()[j].Type() == action) {
        					return selfModel.Rows()[i].Actions()[j].Toggled();
        				}
        			}
        			break;
        		}
        	}
        };

        selfModel.HideRow = function (id) { //this still has bugs with every second row coloring
        	for (i = 0; i < selfModel.Rows().length; i++) {
        		if (selfModel.Rows()[i].Id() == id) {
        			selfModel.Rows()[i].Hidden(true);
        			break;
        		}
        	}
        };

        selfModel.ShowRow = function (id) {
        	for (i = 0; i < selfModel.Rows().length; i++) {
        		if (selfModel.Rows()[i].Id() == id) {
			        selfModel.Rows()[i].Hidden(false);
					break;
		        }
        	}
        };
		
        selfModel.changePage = function (pageData, event) {
            page = pageData.pageNr;
            selfModel.FetchAndUpdate();
        };

        selfModel.prevPage = function (pageData, event) {

            if (selfModel.CurrentPage() <= 1) {
                return;
            }

            page--;
            selfModel.FetchAndUpdate();
        };

        selfModel.nextPage = function (pageData, event) {

            if (selfModel.CurrentPage() >= Math.ceil(selfModel.TotalItemCount() / selfModel.ItemsPerPage())) {
                return;
            }

            page++;
            selfModel.FetchAndUpdate();
        };

        selfModel.FetchAndUpdate = function() {
            sortableListSelf.fetchDataSet(function(fetchedData) {
            	selfModel.MapData(fetchedData);

            	if (selfModel.CurrentPage() > Math.ceil(selfModel.TotalItemCount() / selfModel.ItemsPerPage())) {
            		if (selfModel.TotalItemCount() == 0) {
            			page = 1;
			            return;
		            }
            		page = Math.ceil(selfModel.TotalItemCount() / selfModel.ItemsPerPage());
            		selfModel.FetchAndUpdate();
            	}
            });
        };

        selfModel.MapData = function (inData) {
            ko.mapping.fromJS(inData, {}, selfModel);

            //create paging pages
            var currentPage = 1;

            selfModel.pages([]);

            while (selfModel.TotalItemCount() > (currentPage - 1) * selfModel.ItemsPerPage()) {
                var tmpPage = new sortableListSelf.PagingModel();
                tmpPage.pageNr = currentPage;

                if (currentPage == selfModel.ItemsPerPage()) {
                    tmpPage.active = true;
                }

                selfModel.pages.push(tmpPage);

                currentPage++;
            }
        };


        //This is run when we first create the model to populate with initial data
        selfModel.MapData(data);
    };

}


$(function () {
    $('[data-list-url]').each(function () {

        var newList = new SortableList();
        newList.CreateSortableList(this, $(this).data("list-url"), $(this).data("list-template"), $(this).data("list-content-path"), SortableLists.length, $(this).data("list-settings"));
        SortableLists.push(newList);

    });

  
});

function AttachSortableListToElement(element) {

	var newList = new SortableList();
	newList.CreateSortableList(element[0], $(element).data("list-url"), $(element).data("list-template"), $(element).data("list-content-path"), SortableLists.length, $(element).data("list-settings"));
	SortableLists.push(newList);

}

function ClearNonExistentLists() {
	//list might have existed in popups and simply do no exist any more so we remove them

	index = 0;
	for (list in SortableLists) {
		var container = $(SortableLists[list].GetContainer());
		if (container.length <= 0) {
			SortableLists.splice(index, 1);
		}

		index++;
	}
}

$.fn.extend({

    //Returns the model for the first list in the collection, null if not found
    getListModel: function () {

        if (!this.length)
            return null;

        var element = this.first()[0];
        for (list in SortableLists) {
            if (SortableLists[list].hasOwnProperty("GetContainer") && SortableLists[list].GetContainer() == element) {
                return SortableLists[list].GetModel();
            }
        }
        return null;

    },
    deleteListModel: function () {

    	if (!this.length)
    		return null;

    	var element = this.first()[0];
	    index = 0;
    	for (list in SortableLists) {
    		if (SortableLists[list].GetContainer() == element) {
    			SortableLists.splice(index, 1);
    		}
		    index++;
	    }
    	return null;

    }
});

function afterFailure(id) {
    for (list in SortableLists) {
        if (SortableLists[list].GetId() == id) {
            $(SortableLists[list].GetContainer()).unblock();
        }
    }
}

function getFunctionFromString(string) {
    var scope = window;
    var scopeSplit = string.split('.');
    for (i = 0; i < scopeSplit.length - 1; i++) {
        scope = scope[scopeSplit[i]];

        if (scope == undefined) return;
    }

    return scope[scopeSplit[scopeSplit.length - 1]];
}

/*
function buttonTransform() {

    if (matchMedia(Foundation.media_queries['large']).matches) {
        $(".helperActions button.button").addClass("postfix");
    }
    else {
        $(".helperActions button.button").removeClass("postfix");
    }

}

$(document).ready(buttonTransform);
$(window).resize(buttonTransform);
*/