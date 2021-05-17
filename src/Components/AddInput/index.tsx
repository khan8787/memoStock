import React from 'react';
import Styled from 'styled-components/native';

const Container = Styled.View`display: flex; flex-direction: row; align-items: center; width: 100%; height: 60px; margin-top: 10px;`;
const LabelContainer = Styled.View`min-width: 100px;`;
const InputContainer = Styled.View``;
const Label = Styled.Text`font-size: 23px; color: #929292; font-family: 'NanumBarunpen-bold';`;
const InputField = Styled.TextInput`width: 230px; font-size: 23px; color: #292929; font-family: 'NanumBarunpen';`;
// const Icon = Styled.Image`margin-left: 5px; width: 23px; height: 23px;`;


interface Props {
    label: string,
    value?: string,
    placeholder?: string;
    editable?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    style?: Object;
    clearMode?: boolean;
    inputType: string;
    onChangeText: (text: string, type: string) => void;
}

const AddInput = ({label, placeholder, editable, inputType, value, keyboardType, onChangeText }: Props) => {

    return (
        <Container>
            <LabelContainer>
                <Label>{label}</Label>
            </LabelContainer>
            <InputContainer>
                <InputField 
                    value={value}
                    editable={editable}
                    selectionColor="#292929"
                    secureTextEntry={false}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                    autoCorrect={false}
                    allowFontScaling={false}
                    placeholderTextColor="#C3C3C3"
                    placeholder={placeholder}
                    clearButtonMode={'while-editing'}
                    onChangeText={ text => onChangeText(text, inputType)}
                />
            </InputContainer>
        </Container>
    )
}

export default AddInput;



// selectionColor="#292929"
// secureTextEntry={secureTextEntry}
// keyboardType={keyboardType ? keyboardType : 'default'}
// autoCapitalize="none"
// autoCorrect={false}
// allowFontScaling={false}
// placeholderTextColor="#C3C2C8"
// placeholder={placeholder}
// clearButtonMode={clearMode ? 'while-editing' : 'never'}
// onChangeText={onChangeText} 