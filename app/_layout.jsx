import React from "react"
import {Stack} from 'expo-router'

export default function _layout(){

    return(
        <Stack>
            <Stack.Screen name="index" options={{ 
                title: 'Home'
                }}/>
            <Stack.Screen name="components/EditDesc" options={{ 
                title: 'Description'
                }}/>
             <Stack.Screen name="components/EditContact" options={{ 
                title: 'Contact details'
                }}/> 
            <Stack.Screen name="components/EditImage" options={{ 
                title: 'Logo'
                }}/> 
             <Stack.Screen name="components/EditCategories" options={{ 
                title: 'Categories'
                }}/> 
            <Stack.Screen
                name="components/[id]"
                options={({ route }) => ({
                title: decodeURIComponent(route.params.id) 
                })}
/>

        </Stack>
    )

}