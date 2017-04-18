using System;

namespace SortableList.Models
{
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

        /// <summary>
        ///	If you want any special css classes on this child you can add them here as a space separated string
        /// </summary>
        public string CssClasses { get; set; }
    }
}