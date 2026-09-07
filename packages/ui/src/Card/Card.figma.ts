// url=https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=1-5
import figma from 'figma';

const instance = figma.selectedInstance;

export default {
  example: figma.code`
    <Card
      variant={${instance.getEnum('Variant', {
        Elevated: 'elevated',
        Outlined: 'outlined',
        Filled: 'filled',
      })}}
      title="Card Title"
      description="A brief description of the card content."
    >
      Card body content goes here.
    </Card>
  `,
  imports: ['import { Card } from "@design-system/ui"'],
  id: 'card',
};
