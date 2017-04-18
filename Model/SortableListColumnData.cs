namespace SortableList.Models
{
    public abstract class SortableListColumnData
    {
        protected SortableListColumnData(string type)
        {
            Type = type;
        }


        public string Type { get; }

        /// <summary>
        /// This is the id sent out with an event for the clicked item.
        /// This is not needed if you have an Url set as no event will be fired in that case.
        /// </summary>
        public string Id { get; set; }


        /// <summary>
        ///	If you want any special css classes on this cell you can add them here as a space separated string
        /// </summary>
        public string CssClasses { get; set; }

    }
}