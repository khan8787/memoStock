import React, { useRef, useEffect } from 'react';
import Styled from 'styled-components/native';
import { Animated } from "react-native";

const Container = Styled.TouchableOpacity`flex: 1; width: 100%; height: 100%; position: absolute; top: 0; display: flex; background: rgba(0,0,0, 0.8);`;
const ListContainer = Styled.View`display: flex; align-items: center;`;
const ListImage = Styled.Image`width: 410px;`;

const FingerImage = Styled.Image`width: 50px; height: 50px;`;

const Text = Styled.Text`font-size: 19px; text-align: center; font-family: 'NanumBarunpen-bold'; color: #FFF;`;

interface Props { 
    onPress: () => void;
}

const Help = ({onPress}: Props) => {
    // const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(230)).current;

    useEffect(() => {
        // console.log('Animate start');
        // Animated.loop(
        //     Animated.sequence([
        //         Animated.timing(fadeAnim, {
        //             duration: 700,
        //             toValue: 1,
        //             delay: 500,
        //             useNativeDriver: false,
        //         }),
        //         Animated.timing(fadeAnim, {
        //             duration: 700,
        //             toValue: 0,
        //             delay: 500,
        //             useNativeDriver: false,
        //         }),
        //     ])
        // ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(slideAnim, {
                    duration: 700,
                    toValue: 230,
                    delay: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(slideAnim, {
                    duration: 700,
                    toValue: 130,
                    delay: 500,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    return (
        <Container onPress={onPress} activeOpacity={1}>
            <ListContainer style={{ position: 'relative', marginTop: 30 }}>
                <ListImage style={{ width: 40, height: 40 }} source={require('~/Assets/Images/help/loading.png')} />
                <FingerImage 
                    style={{ position: 'absolute', top: 0, right: 100 }} 
                    source={require('~/Assets/Images/help/scroll_hand.png')} />
            </ListContainer>
            <ListContainer style={{ position: 'relative', marginTop: 10 }}>
                <ListImage style={{ height: 330 }} source={require('~/Assets/Images/help/help_list_open.png')} />
                <Animated.View 
                    style={{ position: 'absolute', top: 50 }} >
                    <FingerImage source={require('~/Assets/Images/help/click_hand.png')} />
                </Animated.View>
                {/* <Animated.View 
                    style={{ position: 'absolute', top: 50, opacity: fadeAnim }} >
                    <FingerImage source={require('~/Assets/Images/help/click_hand.png')} />
                </Animated.View> */}
            </ListContainer>
            <ListContainer style={{ marginTop: 30 }}>
                <ListImage style={{ height: 100 }} source={require('~/Assets/Images/help/help_list_slide.png')} />
            </ListContainer>
            <Animated.View 
                style={{ marginTop: 10, marginLeft: slideAnim }} >
                <FingerImage source={require('~/Assets/Images/help/slide_hand.png')} />
            </Animated.View>
        </Container>
    )
}

export default Help;
