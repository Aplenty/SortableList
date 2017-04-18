using System;

namespace SortableList.Models
{
    public class SortableListRowAction
    {
        /// <summary>
        /// If set to true the text contained in Type variable will be displayed (instead of icon)
        /// The text will be a link and clickable.
        /// </summary>
        public bool IsTextLabel { get; set; }

        /// <summary>
        /// The type of action, could be anything but common would be edit, delete, import
        /// </summary>
        public String Type { get; set; }

        /// <summary>
        /// Will be used as alt text
        /// </summary>
        public String Description { get; set; }

        /// <summary>
        /// The same as Description but will only be displayed when toggled is set to true (can change on client)
        /// If this is empty Description will be shown instead
        /// </summary>
        public String ToggledDescription { get; set; }

        /// <summary>
        /// If set to true it will use the alternative toggled image. Functionality is not changed only the image
        /// Usefull for instance when you want to toggle a setting on or off, the logic run when clicked must also do the right thing as nothing changes a part from image in the list.
        /// The ToggledDescription will be used instead of Description while it's in toggled mode.
        /// </summary>
        public bool Toggled { get; set; }

        /// <summary>
        /// If set to true a disabled version of the image will be displayed not allowing interaction
        /// </summary>
        public bool Disabled { get; set; }

        /// <summary>
        /// If set to the a confirmation dialog is displayed to the user where he needs to confirm the action
        /// </summary>
        public string ConfirmText { get; set; }

        /// <summary>
        /// If this is true the URL will be executed over ajax. This is ignored if no url is set
        /// If the action was performed correctly on the server "ok" should be returned. Anything else returned will be displayed to the user as error
        /// After recieving "ok" the table will reload itself and also send out an event
        /// </summary>
        public bool ExecuteAsAjax { get; set; }

        /// <summary>
        /// Url to be called when clicked
        /// If ExecuteAsAjax is set it will execute the query over ajax and then reload itself
        /// If not set only an event will be fired
        /// If set but also ExecuteAsAjax is set then an event will be sent aswell
        /// </summary>
        public String Url { get; set; }
    }
}