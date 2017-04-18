using System;
using System.Collections.Generic;
using InstalcoIntranet.Features.Company;
using InstalcoIntranet.Infrastructure.Implementations;

namespace SortableList.Models
{
    using System.Collections.Generic;


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
        public String HelpText { get; set; } = string.Empty;

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
}