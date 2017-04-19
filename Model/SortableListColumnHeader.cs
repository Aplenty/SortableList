using System;

namespace SortableList.Models
{
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

        public SortableListColumnHeader()
        {
            
        }

        public SortableListColumnHeader(string label, string sortName)
            : this(label, sortName, false)
        {

        }

        public SortableListColumnHeader(string label, string sortName, bool sortable)
        {
            Label = label;
            SortName = sortName;
            Sortable = sortable;
        }
    }
}