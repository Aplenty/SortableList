using System.Collections.Generic;

namespace SortableList.Models
{
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
}