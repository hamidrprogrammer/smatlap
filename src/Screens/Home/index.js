import React from 'react';
import { View, Switch, Button } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import { Fonts, Images, Metrics } from '@/Constants';
import { McText, McImage, McAvatar } from '@/Components';

const Home = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <Container>
      <McAvatar
        source={require('../../../assets/images/musicoding.png')}
        size={100}
        round
        style={{ marginBottom: 30 }}
      ></McAvatar>
      <McText bold size={24} color={colors.text} style={{ marginBottom: 30 }}>
        MCRN Expo Easy Starter
      </McText>
      <Button
        onPress={async () => {
          const token = await AsyncStorage.getItem('token');
          if(token == null){
            navigation.navigate("Onbordeing");

            return;
          }
          navigation.navigate('Profile');
        }}
        title="Go to Profile"
      ></Button>
    </Container>
  );
};

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.colors.background};
`;
const Text = styled.Text`
  font-size: 30px;
  color: ${(props) => props.theme.colors.text};
`;
export default Home;
