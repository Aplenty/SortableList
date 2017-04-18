using System;

namespace SortableList.Models
{
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
		/// Url to image, if set the image will be displayed next to the label
		/// The image needs to be correct size, no scaling will happen
		/// </summary>
		public String ImageUrl { get; set; }

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