using System;
using System.Collections.Generic;

namespace SortableList.Models
{
	public class SortableList : ViewModelBase
	{
		public SortableList()
		{
			Columns = new List<SortableListColumnHeader>();
			Rows = new List<SortableListRow>();
		}

		/// <summary>
		/// The title of the whole table such as User List.
		/// </summary>
		public String Title { get; set; }

		/// <summary>
		/// If set an icon for displaying a help text will be visible that allows the user to see what he can do with this table 
		/// </summary>
		public String HelpText { get; set; }

		/// <summary>
		/// If set to true there will be a link to add new instance of whatever the table is listing.
		/// If the AddUrl is set we will follow that, otherwise an event will be set.
		/// </summary>
		public bool AddAllowed { get; set; }

		/// <summary>
		/// Ignored if AddAllowed is false
		/// If set the url will be followed when user clicks the add link
		/// </summary>
		public string AddUrl { get; set; }

		/// <summary>
		/// The list of columns aka headers that our table has. For a user table it might be, Firstname, lastname, age
		/// </summary>
		public IList<SortableListColumnHeader> Columns { get; set; }

		/// <summary>
		/// Our rows with data, each row should contain a cell for every column. If the columns are Firstname, lastname, age then each row should contain "Adam", "Best", 27 or similar
		/// </summary>
		public IList<SortableListRow> Rows { get; set; }

		/// <summary>
		/// The currently sorted by name
		/// </summary>
		public string SortedBy { get; set; }

		/// <summary>
		/// Are we currently sorted descending
		/// </summary>
		public bool SortedDescending { get; set; }

		/// <summary>
		/// If the current result is a result of a search/filtering then the string will be set here
		/// </summary>
		public string SearchText { get; set; }

		/// <summary>
		/// The current page we are on
		/// </summary>
		public int CurrentPage { get; set; }

		/// <summary>
		/// The total count of items that we have in our list, this takes the search string into account.
		/// </summary>
		public int TotalItemCount { get; set; }

		/// <summary>
		/// How many items we are displaying per page
		/// </summary>
		public int ItemsPerPage { get; set; }

		/// <summary>
		/// Will hide the actions no matter if there are actions or not
		/// </summary>
		public bool HideActionsColumn { get; set; }

		/// <summary>
		/// If true it will on load put focus on the search field. Maximum sortable list per page should have this set to true.
		/// </summary>
		public bool PutFocusOnSearchField { get; set; }
	}

	public class SortableListColumnHeader
	{
		/// <summary>
		/// If true we allow sorting after this column
		/// </summary>
		public bool Sortable { get; set; }

		/// <summary>
		/// If sorting is allowed, what name will be sent to the server when sorting after this column
		/// </summary>
		public string SortName { get; set; }

		/// <summary>
		/// This is the head of the table, the text in this lable should describe the data in the column, such as "First name"
		/// </summary>
		public String Label { get; set; }
	}

	public class SortableListRow
	{
		public SortableListRow()
		{
			Cells = new List<SortableListColumnData>();
			ActionGroups = new List<SortableListRowActionGroup>();
			Actions = new List<SortableListRowAction>();
		}

		/// <summary>
		/// This is sent with the call if you click something that generates an event.
		/// This is also included when child items are clicked in the generated event.
		/// </summary>
		public string Id { get; set; }

		/// <summary>
		/// If true this row is hidden and not displayed. Good for instance when you want to remove lines of things you have added to another list.
		/// </summary>
		public bool Hidden { get; set; }

		/// <summary>
		/// This is the cells in the row. The content in them should match the order of the Columns (the headers) So if the header says First name for index 0 then index 0 here should be someting like "Arnold"
		/// </summary>
		public IList<SortableListColumnData> Cells { get; set; }

		/// <summary>
		/// Contains a list of action groups that in turn contain actions. all action groups are visually separated and will be rendered before any loose actions (list below)
		/// </summary>
		public IList<SortableListRowActionGroup> ActionGroups { get; set; }

		/// <summary>
		/// Contains a list of actions that can be performed such as edit, delete, view, import
		/// Any action groups will be rendered before loose actions
		/// </summary>
		public IList<SortableListRowAction> Actions { get; set; }
	}


	
	
    public class SortableListLabelColumnData : SortableListColumnData
    {
		public SortableListLabelColumnData() : base("Label")
		{
		    
		}

		/// <summary>
		/// This is the text for this column. If the column header says first name then a reasonable value here is "Arnold"
		/// This is ignored if the Children collection is set.
		/// </summary>
		public String Label { get; set; }

		/// <summary>
		///If this is false the Url attribute will be ignored.
		///If this is true it will either follow Url on click if set, otherwise fire an event
		///The url can be null and this true, as there will then be an event fired.
		/// </summary>
		public bool Interactive { get; set; }

		/// <summary>
		///Url to be called when clicked
		/// </summary>
		public String Url { get; set; }

		/// <summary>
		/// If Url is set you can here decide if the link should be opened in new window or same window
		/// </summary>
		public bool OpenUrlNewWindow { get; set; }
        
	}

    public class SortableListCheckboxColumnData : SortableListColumnData
    {
        public SortableListCheckboxColumnData() : base("Checkbox")
        {
            ActionName = "";
        }

        /// <summary>
        /// The checked state of the control
        /// </summary>
        public bool Checked { get; set; }

        /// <summary>
        /// The name of the event fired in JS when an item is checked/unchecked
        /// It only needs to be set if if you want to listen for check/uncheck events in the frontend
        /// </summary>
        public string ActionName { get; set; }
        
    }

    public class SortableListHtmlColumnData : SortableListColumnData
    {
        public SortableListHtmlColumnData() : base("Html")
        {
            
        }

        /// <summary>
        /// The html to be rendered in the cell
        /// </summary>
        public string Html { get; set; }

    }
	
	
	

	public class SortableListColumnChildren
	{
		/// <summary>
		/// This is the text for this column. If the column header says Licenses name then a reasonable value here is "Main license"
		/// This labels text is always only part of the cell, as all items in the Children collection are printed in the same cell
		/// </summary>
		public String Label { get; set; }

		/// <summary>
		///If this is false the Url attribute will be ignored.
		///If this is true it will either follow Url on click if set, otherwise fire an event
		///The url can be null and this true, as there will then be an event fired.
		/// </summary>
		public bool Interactive { get; set; }

		/// <summary>
		/// This is the id sent out with an event for the clicked item.
		/// This is not needed if you have an Url set as no event will be fired in that case.
		/// </summary>
		public string Id { get; set; }


		/// <summary>
		///Url to be called when clicked
		/// </summary>
		public String Url { get; set; }
	}

	public class SortableListRowActionGroup
	{
		public SortableListRowActionGroup()
		{
			Actions = new List<SortableListRowAction>();
		}

		/// <summary>
		/// Contains a list of actions that can be performed such as edit, delete, view, import
		/// Any action groups will be rendered before loose actions
		/// </summary>
		public IList<SortableListRowAction> Actions { get; set; }
	}

	public class SortableListRowAction
	{
		/// <summary>
		/// If set to true the text contained in Type variable will be displayed (instead of icon)
		/// The text will be a link and clickable.
		/// </summary>
		public bool IsTextLabel { get; set; }

		/// <summary>
		/// The type of action, could be anything but common would be edit, delete, import
		/// </summary>
		public String Type { get; set; }

		/// <summary>
		/// Will be used as alt text
		/// </summary>
		public String Description { get; set; }

		/// <summary>
		/// The same as Description but will only be displayed when toggled is set to true (can change on client)
		/// If this is empty Description will be shown instead
		/// </summary>
		public String ToggledDescription { get; set; }

		/// <summary>
		/// If set to true it will use the alternative toggled image. Functionality is not changed only the image
		/// Usefull for instance when you want to toggle a setting on or off, the logic run when clicked must also do the right thing as nothing changes a part from image in the list.
		/// The ToggledDescription will be used instead of Description while it's in toggled mode.
		/// </summary>
		public bool Toggled { get; set; }

		/// <summary>
		/// If set to true a disabled version of the image will be displayed not allowing interaction
		/// </summary>
		public bool Disabled { get; set; }

		/// <summary>
		/// If set to the a confirmation dialog is displayed to the user where he needs to confirm the action
		/// </summary>
		public string ConfirmText { get; set; }

		/// <summary>
		/// If this is true the URL will be executed over ajax. This is ignored if no url is set
		/// If the action was performed correctly on the server "ok" should be returned. Anything else returned will be displayed to the user as error
		/// After recieving "ok" the table will reload itself and also send out an event
		/// </summary>
		public bool ExecuteAsAjax { get; set; }

		/// <summary>
		/// Url to be called when clicked
		/// If ExecuteAsAjax is set it will execute the query over ajax and then reload itself
		/// If not set only an event will be fired
		/// If set but also ExecuteAsAjax is set then an event will be sent aswell
		/// </summary>
		public String Url { get; set; }
	}
}