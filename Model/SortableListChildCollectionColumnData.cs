using System.Collections.Generic;

namespace SortableList.Models
{
    public class SortableListChildCollectionColumnData : SortableListColumnData
    {
        public SortableListChildCollectionColumnData() : base("ChildCollection")
        {
            Children = new List<SortableListColumnChildren>();
        }

        /// <summary>
        /// A Column can contain a list of all the children. Theoretically it could be a list of anything, but children is most logical
        /// </summary>
        public IList<SortableListColumnChildren> Children { get; set; }

    }
}