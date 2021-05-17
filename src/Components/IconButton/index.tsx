import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.TouchableOpacity``;
const Icon = Styled.Image``;

interface Props {
    iconName: | 'add' | 'refresh' | 'menu';
    style?: object;
    onPress?: () => void;
}

const IconButton = ({iconName, style, onPress}: Props) => {
    const imageSource = {
        add: require('~/Assets/Images/add.png'),
        refresh: require('~/Assets/Images/refresh.png'),
        menu: require('~/Assets/Images/ic_menu.png'),
    }

    return (
        <Container 
            onPress={() => {
                if(onPress && typeof onPress === 'function') {
                    onPress();
                }
            }}>
            <Icon style={style} source={imageSource[iconName]}/>
        </Container>
    )
}

export default IconButton;