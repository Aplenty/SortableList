namespace SortableList.Models
{
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
}