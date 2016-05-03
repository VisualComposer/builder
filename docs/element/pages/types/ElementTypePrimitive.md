### Primitives

Primitive is dublicate html element:
- Paragraph => p
- Image => img
- Section => div

All primitives duplicates already existing html tag elements. Developer can use html tags or our primitives. 
Primitives has predefined attributes if dev addes it to template, it will be automaticly added to edit form list.

Example:

<div className="super-element">
    <Paragraph color="{color}">
        {content}
    </Paragraph>
</div>
Configurations:
{
	name: "color"
	title: "Main color"
	type: "Paragraph:color"
}

Color attribute will be added to list of edit form fields with type colorPicker automatically. Or you can any kid of settings for this 
