// url=https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=1-4
import figma from 'figma';

const instance = figma.selectedInstance;

export default {
  example: figma.code`
    <Badge
      variant={${instance.getEnum('Variant', {
        Default: 'default',
        Primary: 'primary',
        Success: 'success',
        Warning: 'warning',
        Danger: 'danger',
      })}}
      size={${instance.getEnum('Size', {
        Small: 'sm',
        Medium: 'md',
      })}}
    >
      ${instance.getString('Label')}
    </Badge>
  `,
  imports: ['import { Badge } from "@design-system/ui"'],
  id: 'badge',
};
