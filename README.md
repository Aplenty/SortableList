# SortableList
Sortable, paged listing with javacript events. Lightweight and flexible

Dependencies: Jquery, BlockUI, Knockout, Knockout mapping

Foundation support for figuring out if in will size

Has support for using both translation files in different languages as well as i18n (https://github.com/turquoiseowl/i18n) plugin with [[[text]]] as nuggets

V 0.0.5 Knockout driven with c# class as DTO.

------------------------------------------------------------

**Configuration**

The following can exist on the sortable list html element

_1. data-list-url_
- Sets the url to the method for getting list data.
- Example: `data-list-url="@Url.Action("AccountList")"`

_2. data-list-content-path_
- The path to icons and any other content needed by sortable list
- Example: `data-list-content-path="@Url.Content("~/Content/Images/icons/")"` 

_3. data-list-settings_
- Allows multiple different settings
  * add-label: Sets the text of the add new button
  * icon-file-ending: Sets the file ending for icons, default if not set is .svg
- Example: `data-list-settings='{"add-label":"[[[Add]]]", "icon-file-ending":"png"}'`
