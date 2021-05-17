import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.TouchableOpacity`display: flex; align-items: center; justify-content: center; margin-left: 10px; width: 50px; height: 50px; border-radius: 50px;`;
const Icon = Styled.Image`width: 25px; height: 25px;`;

interface Props {
    iconName: | 'remove' | 'modify';
    isin: string;
    index: number;
    style?: object;
    onPress?: (index: number) => void;
    closeStock?: () => void;
}

const ListHiddenButton = ({iconName, style, index, isin, onPress, closeStock}: Props) => {
    const imageSource = {
        remove: require('~/Assets/Images/trash-can.png'),
        modify: require('~/Assets/Images/ico_setting.png'),
    }

    const backgroundColor = {
        remove: '#d46960',
        modify: '#808dde'
    }

    return (
        <Container 
            style={{backgroundColor: backgroundColor[iconName]}}
            onPress={() => {
                if(onPress && typeof onPress === 'function') {
                    onPress(index);
                    closeStock && closeStock();
                }
            }}>
            <Icon style={style} source={imageSource[iconName]}/>
        </Container>
    )
}

export default ListHiddenButton;