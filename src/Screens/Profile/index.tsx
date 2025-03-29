import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Platform, Linking, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import IconA from "react-native-vector-icons/AntDesign";
import { StackActions, useNavigation } from "@react-navigation/native";

import {Block, ButtonPro, Image, Text} from '../../Components';
import {useData, useTheme} from '../../hooks';
import { Avatar, Icon } from 'react-native-elements';
import eventServise from '../../Servise/Events/eventServise';
import { EventContext } from '../../Servise/Events/eventContaxt';
import { Card, Dialog, Paragraph, Portal } from 'react-native-paper';
import { Colors } from '../../Constants';
import { removeAllDataFromAsyncStorage } from '../../core/save';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native';
import { ImageBackground } from 'react-native';
import { AthContext, AthContextProvider } from '@/Servise/Ath/athContaxt';
import Service from "../../Servise/api";

const isAndroid = Platform.OS === 'android';

const Profile = ({navigation}) => {
  const {user} = useContext(AthContext);
  const {assets, colors, sizes} = useTheme();
  const {fetchGetUserRank,dataUserRank,dataUser,userID} = useContext(EventContext)
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;
  useEffect(() => {
    
    fetchGetUserRank()
    return () => {
      
    }
  }, [])
  useEffect(() => {
    
    console.log("user=======================");
     console.log(dataUser);
     
     
     
  }, [])
  const deleteAccount = async (userId) => {
    try {
        const response = await Service.api.post(
            '/DeleteAccount',
            null, // No request body is needed for this API
            {
                params: { userId },
              
            }
        );

        return response.data; // Handle the API response
    } catch (error) {
        console.error('Error deleting account:', error.response?.data || error.message);
        return { status: 0, message: 'Failed to delete account' };
    }
};

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch (error) {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );
  const renderValue = (user: Partial<any>) => {
    const { totalPoint, positive } = user;

    if (!positive) {
      return (
        <View
          style={{
           
            width: 100,
            height: 28,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: 10,
          }}
        >
          <Icon
            name="caret-up-outline"
            type="ionicon"
            color="green"
            size={25}
          />
          <Text
            style={{
              color: 'green',
           
              fontSize: 13,
              marginLeft: 5,
            }}
          >
            {totalPoint}
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            backgroundColor: 'rgba(244,230,224,1)',
            width: 70,
            height: 28,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginLeft: 10,
          }}
        >
          <Icon
            name="caret-down-outline"
            type="ionicon"
            color="red"
            size={25}
          />
          <Text
            style={{
              color: 'red',
        
              fontSize: 13,
              marginLeft: 5,
            }}
          >
            {totalPoint}
          </Text>
        </View>
      );
    }
  };
  const renderCard = (user: Partial<any>, index: React.Key) => {
    const { name, avatar } = user;
    return (
      <View style={{marginTop:8,backgroundColor: "#fff"}}>
      <View
        key={index}
        style={{
          height: 60,
          marginHorizontal: 10,
          marginTop: 10,
          borderRadius: 5,
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginLeft: 15 }}>
            <Avatar
              rounded
              source={{
                uri: user?.avatarUrl,
              }}
              activeOpacity={0.7}
            />
          </View>
          <Text
          black
            style={{
              color: Colors.black,
              fontSize: 15,
              marginLeft: 10,
            }}
          >
            {user?.fullName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          {renderValue(user)}
          
        </View>
      </View>
      </View>
    );
  };

  const renderListCards = () => {
    return dataUserRank?.map((user, index) => {
      return renderCard(user, index);
    });
  };
  const [logoutVisible, setLogoutVisible] = useState(false);
  const showLogoutDialog = () =>{
     setLogoutVisible(true);}
  const hideLogoutDialog = () => setLogoutVisible(false);
  function handleLogout() {
    removeAllDataFromAsyncStorage();
              setTimeout(() => {
                navigation.replace(
                  "SplashScreen"
                )
              }, 2000);
              setLogoutVisible(false);
  }
  const [deleteVisible, setDeleteVisible] = useState(false);
  const showDeleteDialog = () => setDeleteVisible(true);
  const hideDeleteDialog = () => setDeleteVisible(false);

  const handleDeleteAccount = () => {
    // Add account deletion logic here
    deleteAccount(userID).then((response) => {
      removeAllDataFromAsyncStorage();
              setTimeout(() => {
                navigation.replace(
                  "SplashScreen"
                )
              }, 1000);
              hideDeleteDialog();
    });

    hideDeleteDialog();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
    <ImageBackground
      resizeMode='contain'
      style={styles.header}
      source={require('../../../assets/heeaderProofile.png')}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />
    </ImageBackground>

    <Block safe marginTop={sizes.md} style={{backgroundColor: "#fff"}}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.padding}}>
        
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Block flex={0} align="center">
            <Image
              width={80}
              height={80}
              marginBottom={sizes.sm}
              source={{uri: dataUser?.avatarUrl}}
              style={styles.avatar}
            />
            <Text h4 center bold style={styles.userName}>{dataUser?.fullName}</Text>
            <Text p center style={styles.teamName}>{dataUser?.teamName}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={showLogoutDialog}>
                <IconA name="logout" size={28} color={colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={showDeleteDialog}>
                <IconA name="delete" size={28} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </Block>
        </View>

        {/* Ranking List */}
        {renderListCards()}
      </Block>
    </Block>

    {/* Logout Dialog */}
    <Portal>
      <Dialog visible={logoutVisible} onDismiss={hideLogoutDialog} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogText}>Are you sure you want to log out?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <TouchableOpacity onPress={hideLogoutDialog} style={styles.dialogButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={[styles.dialogButton, styles.confirmButton]}>
            <Text style={styles.confirmText}>Log Out</Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
    </Portal>

    {/* Delete Account Dialog */}
    <Portal>
      <Dialog visible={deleteVisible} onDismiss={hideDeleteDialog} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Delete Account</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogText}>Are you sure you want to delete your account? This action cannot be undone.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <TouchableOpacity onPress={hideDeleteDialog} style={styles.dialogButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAccount} style={[styles.dialogButton, styles.deleteButton]}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 70,
    width: '100%'
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 130,
    height: 90
  },
  profileCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  avatar: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff'
  },
  userName: {
    marginTop: 8,
    color: '#2D3748',
    letterSpacing: 0.5
  },
  teamName: {
    color: '#718096',
    marginBottom: 16
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F7FAFC'
  },
  dialog: {
    borderRadius: 16,
    padding: 8
  },
  dialogTitle: {
    color: '#2D3748',
    fontWeight: '600'
  },
  dialogText: {
    color: '#718096',
    lineHeight: 24
  },
  dialogActions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dialogButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  confirmButton: {
    backgroundColor: '#4299E1'
  },
  deleteButton: {
    backgroundColor: '#FEB2B2'
  },
  cancelText: {
    color: '#718096',
    fontWeight: '500'
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600'
  },
  deleteText: {
    color: '#C53030',
    fontWeight: '600'
  }
});
export default Profile;