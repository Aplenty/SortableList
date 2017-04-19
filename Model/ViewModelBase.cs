using System.Collections.Generic;

namespace SortableList.Models
{
	public class ViewModelBase
	{
		public bool OperationPermissionAccessValid { get; set; }

        public bool OperationSuccess { get; set; } //Indicates if the required action was a success, this could be askins for data as well as submitting data
        public string OperationMessage { get; set; } //The message will be displayed to the user no matter if success or not

		//These are mostly meant to be used if you want return ViewModelBase directly to just return something simple like an id
		public int? OperationResponseId { get; set; }
		public bool? OperationResponseBool { get; set; }
        public string OperationResponseTextOrHtml { get; set; } //used when all you want to do is return some simple text or rendered html

    }
}