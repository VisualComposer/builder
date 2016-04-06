### Simple elements

All elements contains html tag,other elements

Other elements: Primitives or other elements
<div className="super-element">
    <Paragraph color="{color}">
        <Icon/>{content}
    </Paragraph>
</div>


Elements can be:
- with inner content: other html/Components
- self closed, like <Icon/> - elements can't contain

Self closed settings:

{
    name: 'self-closed',
    type: 'boolean',
    access: 'system',
    value: true,
}