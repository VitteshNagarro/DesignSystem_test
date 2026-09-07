import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=TYPOGRAPHY_NODE_ID',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'body', 'body-sm', 'caption', 'label'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    color: {
      control: 'select',
      options: ['default', 'muted', 'inverse', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Display: Story = {
  args: { variant: 'display', weight: 'bold', children: 'Display Heading' },
};

export const Heading1: Story = {
  args: { variant: 'h1', weight: 'semibold', children: 'Heading 1' },
};

export const Heading2: Story = {
  args: { variant: 'h2', weight: 'semibold', children: 'Heading 2' },
};

export const Body: Story = {
  args: { variant: 'body', children: 'Body text for paragraphs and general content.' },
};

export const Caption: Story = {
  args: { variant: 'caption', color: 'muted', children: 'Caption text' },
};

export const Label: Story = {
  args: { variant: 'label', weight: 'medium', children: 'Form Label' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-spacing-md">
      <Typography variant="display" weight="bold">
        Display
      </Typography>
      <Typography variant="h1" weight="semibold">
        Heading 1
      </Typography>
      <Typography variant="h2" weight="semibold">
        Heading 2
      </Typography>
      <Typography variant="h3" weight="medium">
        Heading 3
      </Typography>
      <Typography variant="body">Body text</Typography>
      <Typography variant="body-sm" color="muted">
        Body small muted
      </Typography>
      <Typography variant="caption" color="muted">
        Caption
      </Typography>
      <Typography variant="label" weight="medium">
        Label
      </Typography>
    </div>
  ),
};
