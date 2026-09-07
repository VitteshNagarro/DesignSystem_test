import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const FIGMA_FILE =
  'https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Label' },
  parameters: {
    design: {
      type: 'figma',
      url: `${FIGMA_FILE}?node-id=4-81`,
    },
  },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Label' },
  parameters: {
    design: {
      type: 'figma',
      url: `${FIGMA_FILE}?node-id=4-101`,
    },
  },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Label' },
  parameters: {
    design: {
      type: 'figma',
      url: `${FIGMA_FILE}?node-id=4-103`,
    },
  },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Label' },
  parameters: {
    design: { type: 'figma', url: `${FIGMA_FILE}?node-id=4-81` },
  },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Label' },
  parameters: {
    design: { type: 'figma', url: `${FIGMA_FILE}?node-id=4-81` },
  },
};

export const Loading: Story = {
  args: { loading: true, children: 'Label' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Label' },
};

export const AllVariants: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: `${FIGMA_FILE}?node-id=4-82`,
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-spacing-md">
      <Button variant="primary">Label</Button>
      <Button variant="secondary">Label</Button>
      <Button variant="tertiary">Label</Button>
    </div>
  ),
};
