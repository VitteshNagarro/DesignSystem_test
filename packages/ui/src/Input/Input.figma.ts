// url=https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=1-3
import figma from 'figma';

const instance = figma.selectedInstance;

export default {
  example: figma.code`
    <Input
      size={${instance.getEnum('Size', {
        Small: 'sm',
        Medium: 'md',
        Large: 'lg',
      })}}
      state={${instance.getEnum('State', {
        Default: 'default',
        Error: 'error',
        Disabled: 'disabled',
      })}}
      label="Email"
      placeholder="you@example.com"
    />
  `,
  imports: ['import { Input } from "@design-system/ui"'],
  id: 'input',
};
