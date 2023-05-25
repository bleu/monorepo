module.exports = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Disallow Tailwind CSS colors in classNames',
        category: 'Best Practices',
        recommended: true,
      },
      schema: [],
    },
    create: function (context) {
      const tailwindColors = [
        'gray-', 'red-', 'yellow-', 'green-', 'blue-', 'indigo-', 'purple-', 'pink-',
        'white-', 'black-',
      ];
  
      function isTailwindColor(value) {
        return tailwindColors.some((color) => value.includes(color));
      }
  
      return {
        JSXAttribute: function (node) {
          if (node.name.name === 'className' && node.value && node.value.type === 'Literal') {
            const classNames = node.value.value.split(' ');
  
            classNames.forEach((className) => {
              if (isTailwindColor(className)) {
                context.report({
                  node,
                  message: 'Do not use Tailwind CSS colors in classNames.',
                });
              }
            });
          }
        },
      };
    },
  };
  