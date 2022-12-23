import React, { memo } from 'react';
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  withDelay,
  withTiming
} from 'react-native-reanimated';

// Components
import { BlurView } from '@react-native-community/blur';
// Utils
import {
  CONTEXT_MENU_STATE,
  HOLD_ITEM_TRANSFORM_DURATION, WINDOW_HEIGHT
} from '../../constants';
import { useInternal } from '../../hooks';
import { styles } from './styles';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

type Context = {
  startPosition: {
    x: number;
    y: number;
  };
};

const BackdropComponent = () => {
  const { state, theme } = useInternal();

  const tapGestureEvent = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent,
    Context
  >(
    {
      onStart: (event, context) => {
        context.startPosition = { x: event.x, y: event.y };
      },
      onCancel: () => {
        state.value = CONTEXT_MENU_STATE.END;
      },
      onEnd: (event, context) => {
        const distance = Math.hypot(
          event.x - context.startPosition.x,
          event.y - context.startPosition.y
        );
        const shouldClose = distance < 10;
        const isStateActive = state.value === CONTEXT_MENU_STATE.ACTIVE;

        if (shouldClose && isStateActive) {
          state.value = CONTEXT_MENU_STATE.END;
        }
      },
    },
    [state]
  );

  const animatedContainerStyle = useAnimatedStyle(() => {
    const topValueAnimation = () =>
      state.value === CONTEXT_MENU_STATE.ACTIVE
        ? 0
        : withDelay(
            HOLD_ITEM_TRANSFORM_DURATION,
            withTiming(WINDOW_HEIGHT, {
              duration: 0,
            })
          );

    const opacityValueAnimation = () =>
      withTiming(state.value === CONTEXT_MENU_STATE.ACTIVE ? 1 : 0, {
        duration: HOLD_ITEM_TRANSFORM_DURATION,
      });

    return {
      top: topValueAnimation(),
      opacity: opacityValueAnimation(),
    };
  });

  const animatedContainerProps = useAnimatedProps(() => {
    return {
      blurAmount: withTiming(
        state.value === CONTEXT_MENU_STATE.ACTIVE ? 0 : 2,
        {
          duration: HOLD_ITEM_TRANSFORM_DURATION,
        }
      ),
    };
  });


  return (
    <TapGestureHandler onHandlerStateChange={tapGestureEvent}>
      <AnimatedBlurView
        // @ts-ignore
        overlayColor={"#00000030"}
        reducedTransparencyFallbackColor={"#00000030"}
        animatedProps={animatedContainerProps}
        style={[styles.container, animatedContainerStyle]}
      >
 
      </AnimatedBlurView>
    </TapGestureHandler>
  );
};

const Backdrop = memo(BackdropComponent);

export default Backdrop;
