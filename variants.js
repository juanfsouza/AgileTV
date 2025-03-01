export const fadeIn = (direction, delay) => {
    return {
      hidden: {
        y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
        opacity: 0,
        x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
      },
      show: {
        y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 1.2,
          delay: delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      },
    };
  };

  export const slideUp = (delay = 0) => ({
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.7,
        ease: 'easeInOut',
      },
    },
  });
  
  