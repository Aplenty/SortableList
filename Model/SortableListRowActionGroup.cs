using System.Collections.Generic;

namespace SortableList.Models
{
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
}