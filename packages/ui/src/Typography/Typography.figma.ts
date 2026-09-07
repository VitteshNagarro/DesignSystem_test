// url=https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=1-6
import figma from 'figma';

const instance = figma.selectedInstance;

export default {
  example: figma.code`
    <Typography
      variant={${instance.getEnum('Variant', {
        Display: 'display',
        H1: 'h1',
        H2: 'h2',
        H3: 'h3',
        Body: 'body',
        'Body Small': 'body-sm',
        Caption: 'caption',
        Label: 'label',
      })}}
      weight={${instance.getEnum('Weight', {
        Regular: 'regular',
        Medium: 'medium',
        Semibold: 'semibold',
        Bold: 'bold',
      })}}
      color={${instance.getEnum('Color', {
        Default: 'default',
        Muted: 'muted',
        Inverse: 'inverse',
        Danger: 'danger',
      })}}
    >
      ${instance.getString('Text')}
    </Typography>
  `,
  imports: ['import { Typography } from "@design-system/ui"'],
  id: 'typography',
};
