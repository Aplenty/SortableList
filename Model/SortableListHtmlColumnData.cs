using System;

namespace SortableList.Models
{
    public class SortableListHtmlColumnData : SortableListColumnData
    {
        public SortableListHtmlColumnData() : base("Html")
        {

        }

        /// <summary>
        /// The html to be rendered in the cell
        /// </summary>
        public string Html { get; set; }

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
}