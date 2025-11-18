import { useNavigation } from "@react-navigation/native";
import React from "react";
import SignUp from "./SignUp";

export default function SignUpScreen() {
  const navigation = useNavigation();
  
  return <SignUp navigation={navigation} />;
}
