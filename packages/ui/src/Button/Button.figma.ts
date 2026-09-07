// url=https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=4-82
import figma from 'figma';

const instance = figma.selectedInstance;

export default {
  example: figma.code`
    <Button
      variant={${instance.getEnum('Variant', {
        Primary: 'primary',
        Secondary: 'secondary',
        Tertiary: 'tertiary',
      })}}
    >
      ${instance.getString('Label')}
    </Button>
  `,
  imports: ['import { Button } from "@design-system/ui"'],
  id: 'button',
};
