import { Tutorial } from '@/contexts/TutorialContext';

export const algorithmVisualizerTutorial: Tutorial = {
  id: 'algorithm-visualizer-basics',
  name: 'Algorithm Visualizer Basics',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Algorithm Visualizer!',
      content: 'This tutorial will guide you through the basics of using our algorithm visualizer. You\'ll learn how to select algorithms, control playback, and understand the visualizations.',
    },
    {
      id: 'algorithm-selector',
      title: 'Select an Algorithm',
      content: 'Start by choosing an algorithm from the dropdown menu. We have sorting algorithms like Bubble Sort and Quick Sort, plus searching algorithms like Binary Search.',
    },
    {
      id: 'data-input',
      title: 'Customize Your Data',
      content: 'You can input your own data or generate random arrays. Try different data patterns to see how algorithms behave with various inputs.',
    },
    {
      id: 'playback-controls',
      title: 'Control Playback',
      content: 'Use the play, pause, reset, and step controls to navigate through the algorithm execution. You can also adjust the speed to match your learning pace.',
    },
    {
      id: 'visualization',
      title: 'Watch the Magic Happen',
      content: 'The main visualization area shows the algorithm in action. Different colors indicate what the algorithm is currently doing - comparing, swapping, or highlighting elements.',
    },
    {
      id: 'step-explanation',
      title: 'Step-by-Step Details',
      content: 'The explanation panel shows detailed information about each step, including comparisons, swaps, and performance statistics.',
    },
  ]
};

export const algorithmComparisonTutorial: Tutorial = {
  id: 'algorithm-comparison-basics',
  name: 'Algorithm Comparison Guide',
  steps: [
    {
      id: 'comparison-intro',
      title: 'Compare Algorithms Side by Side',
      content: 'The comparison page lets you run two algorithms simultaneously to see how they perform with the same data.',
    },
    {
      id: 'input-data',
      title: 'Set Up Your Data',
      content: 'Both algorithms will use the same input data. Enter your own array or generate a random one to test with.',
    },
    {
      id: 'algorithm-selection',
      title: 'Choose Your Algorithms',
      content: 'Select different algorithms for each side. Try comparing a fast algorithm like Quick Sort with a slower one like Bubble Sort.',
    },
    {
      id: 'performance-metrics',
      title: 'Performance Analysis',
      content: 'Watch real-time performance metrics as the algorithms run. See which one makes fewer comparisons or completes faster.',
    },
  ]
};

export const customBuilderTutorial: Tutorial = {
  id: 'custom-builder-basics',
  name: 'Custom Algorithm Builder',
  steps: [
    {
      id: 'builder-intro',
      title: 'Build Your Own Algorithm',
      content: 'The custom builder lets you write and visualize your own algorithms. Perfect for learning and experimentation!',
    },
    {
      id: 'code-editor',
      title: 'Write Your Code',
      content: 'Use the code editor to write your algorithm. The editor supports syntax highlighting and has undo/redo functionality.',
    },
    {
      id: 'templates',
      title: 'Start with Templates',
      content: 'Check out the pre-built templates to understand the expected format. Each template shows how to structure your algorithm for visualization.',
    },
    {
      id: 'test-algorithm',
      title: 'Test Your Algorithm',
      content: 'Click the run button to test your algorithm. Any errors will be shown, and successful runs will generate visualizations.',
    },
  ]
};

export const allTutorials: Tutorial[] = [
  algorithmVisualizerTutorial,
  algorithmComparisonTutorial,
  customBuilderTutorial,
];

export default allTutorials;