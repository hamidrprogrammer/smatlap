import React from 'react';
import {Platform, StyleSheet, Text, TextStyle} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import MaskedView from '@react-native-community/masked-view';

import useTheme from '../hooks/useTheme';
import {ITextProps} from '../constants/types';

const Typography = (props: ITextProps) => {
  const {
    id = 'Text',
    children,
    style,
    center,
    gradient,
    color,
    opacity,
    // predefined colors
    primary,
    secondary,
    tertiary,
    black,
    white,
    gray,
    danger,
    warning,
    success,
    info,
    size,
    bold,
    semibold,
    weight,
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    font,
    align,
    transform,
    lineHeight,
    position,
    right,
    left,
    top,
    bottom,
    start,
    end,
    marginBottom,
    marginTop,
    marginHorizontal,
    marginVertical,
    marginRight,
    marginLeft,
    paddingBottom,
    paddingTop,
    paddingHorizontal,
    paddingVertical,
    paddingRight,
    paddingLeft,
    ...rest
  } = props;
  const {colors, sizes, lines, weights, fonts} = useTheme();

  const colorIndex = primary
    ? 'primary'
    : secondary
    ? 'secondary'
    : tertiary
    ? 'tertiary'
    : black
    ? 'black'
    : white
    ? 'white'
    : gray
    ? 'gray'
    : danger
    ? 'danger'
    : warning
    ? 'warning'
    : success
    ? 'success'
    : info
    ? 'info'
    : null;
  const textColor = color
    ? color
    : colorIndex
    ? colors?.[colorIndex]
    : undefined;

  const textStyles = StyleSheet.flatten([
    style,
    {
      color: colors.text,
      fontSize: 10,
      lineHeight: lines.text,
      fontWeight: weights.text,
      fontFamily: "Poppins-Black",
      ...(textColor && {color: textColor}),
      ...(h1 && {
        fontSize: 10,
        lineHeight: lines.h1,
        fontWeight: weights.h1,
        fontFamily: "Poppins-Black",
      }),
      ...(h2 && {
        fontSize: 10,
        lineHeight: lines.h2,
        fontWeight: weights.h2,
        fontFamily:"Poppins-Black",
      }),
      ...(h3 && {
        fontSize: 10,
        lineHeight: lines.h3,
        fontWeight: weights.h3,
        fontFamily: "Poppins-Black",
      }),
      ...(h4 && {
        fontSize: 10,
        lineHeight: lines.h4,
        fontWeight: weights.h4,
        fontFamily: "Poppins-Black",
      }),
      ...(h5 && {
        fontSize: 10,
        lineHeight: lines.h5,
        fontWeight: weights.h5,
        fontFamily: "Poppins-Black",
      }),
      ...(p && {
        fontSize: 10,
        lineHeight: lines.p,
        fontWeight: weights.p,
        fontFamily: "Poppins-Black",
      }),
      ...(marginBottom && {marginBottom}),
      ...(marginTop && {marginTop}),
      ...(marginHorizontal && {marginHorizontal}),
      ...(marginVertical && {marginVertical}),
      ...(marginRight && {marginRight}),
      ...(marginLeft && {marginLeft}),
      ...(paddingBottom && {paddingBottom}),
      ...(paddingTop && {paddingTop}),
      ...(paddingHorizontal && {paddingHorizontal}),
      ...(paddingVertical && {paddingVertical}),
      ...(paddingRight && {paddingRight}),
      ...(paddingLeft && {paddingLeft}),
      ...(center && {textAlign: 'center'}),
      ...(align && {textAlign: align}),
      ...(bold && {fontFamily: "Poppins-Black"}),
      ...(semibold && {fontFamily: "Poppins-Black"}),
      ...(weight && {fontWeight: weight}),
      ...(transform && {textTransform: transform}),
      ...(font && {fontFamily: "Poppins-Black"}),
      ...(size && {fontSize: 10}),
      ...(color && {color}),
      ...(opacity && {opacity}),
      ...(lineHeight && {lineHeight}),
      ...(position && {position}),
      ...(right !== undefined && {right}),
      ...(left !== undefined && {left}),
      ...(top !== undefined && {top}),
      ...(bottom !== undefined && {bottom}),
    },
  ]) as TextStyle;

  /*
   * Calculate gradient height container based on text lineHeight or fontSize
   * add an extra value from marginVertical or marginTop or marginBottom
   */
  const gradientHeight =
    Number(textStyles?.lineHeight || textStyles?.fontSize || 0) +
    Number(
      textStyles?.marginVertical ||
        textStyles?.marginTop ||
        textStyles?.marginBottom ||
        0,
    );

  // generate component testID or accessibilityLabel based on Platform.OS
  const textID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  if (gradient) {
    return (
      <MaskedView
        maskElement={
          <Text {...textID} {...rest} style={textStyles}>
            {children}
          </Text>
        }>
        <LinearGradient
          colors={gradient}
          end={end || [0.2, 0]}
          start={start || [0, 0]}
          style={{flex: 1, height: gradientHeight, flexWrap: 'wrap'}}
        />
      </MaskedView>
    );
  }

  return (
    <Text {...textID} {...rest} style={textStyles}>
      {children}
    </Text>
  );
};

export default React.memo(Typography);
