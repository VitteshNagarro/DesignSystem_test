import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/iVt954yRRUlVSlWU4HJygU/DesignSystem_Test?node-id=INPUT_NODE_ID',
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'error', 'disabled'] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: 'Email', placeholder: 'you@example.com' },
};

export const WithHelper: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helperText: 'Must be at least 3 characters',
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    state: 'error',
    errorMessage: 'Please enter a valid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    state: 'disabled',
  },
};

export const Small: Story = {
  args: { size: 'sm', label: 'Small input', placeholder: 'Small' },
};

export const Large: Story = {
  args: { size: 'lg', label: 'Large input', placeholder: 'Large' },
};
