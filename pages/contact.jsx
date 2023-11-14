'use client'

import { useState } from 'react';
import { Paper, Text, TextInput, Textarea, Button, Group, SimpleGrid, Notification } from '@mantine/core';
import { ContactIconsList } from '@/components/ContactIcons';
import emailjs from '@emailjs/browser';
import classes from './Contact.module.css';
import { useForm } from '@mantine/form';
import {IconCheck, IconX} from '@tabler/icons-react'

export default function GetInTouch() {
  const [notification, setNotification] = useState(null);

  function ShowNotif(title, msg, status){
    console.log("SHOW NOTIF");
    setNotification(
      <Notification 
      icon={status === "ERROR" ? <IconX size="1.2rem" />:<IconCheck size="1.2rem" />} 
      title={title} 
      onClose={() => setNotification(null)}
      color={status==="ERROR" ? "red":"blue"} 
      >
        {msg}
      </Notification>
    );
  }

  async function SendEmail(event){
    event.preventDefault();
    console.log("SENT", event.target)

    emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID, process.env.NEXT_PUBLIC_SERVICE_TEMPLATE_ID, event.target, process.env.NEXT_PUBLIC_PUBLIC_KEY)
    .then((result)=>{
      console.log("RES", result)
      if(result.text==='OK')
        ShowNotif("SUBMITTED", result.text, "SUCCESS")
    })
    .catch(error =>{
      console.log("ERR", error)
      if(error.text==='')
      console.log("KESINI", error)
         ShowNotif("FAILED", "Please, check your internet connection!", "ERROR")
    });
  }

  const form = useForm({
    initialValues: { username: '', email_from: '', message: ''},

    // functions will be used to validate values at corresponding key
    validate: {
        username: (value) => (value.length == 0)  ? 'Name must be filled' : (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) ? 'Name is not allowed special character' : null,
        email_from: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <Paper shadow="md" style={{width:'80%', paddingLeft:'20%', justifyContent:'center', alignItems:'center'}} radius="lg">
      <div className={classes.wrapper}>
        <div className={classes.contacts}  style={{ backgroundColor: 'black' }}>
          <Text fz="lg" fw={700} className={classes.title} c="#fff">
            Contact information
          </Text>

          <ContactIconsList />
        </div>

        <form className={classes.form} onSubmit={(event) => SendEmail(event)}>
          <Text fz="lg" fw={700} className={classes.title}>
            Get in touch
          </Text>

          <div className={classes.fields}>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput 
              label="Your name" 
              placeholder="Your name" 
              required
              name='username'
              {...form.getInputProps('username')}
              />
              <TextInput 
              label="Your email" 
              placeholder="hello@mantine.dev" 
              required
              name='email_from'
              {...form.getInputProps('email_from')}
              />
            </SimpleGrid>

            <Textarea
              mt="md"
              label="Your message"
              placeholder="Please include all relevant information"
              minRows={3}
              required
              name='messages'
              {...form.getInputProps('messages')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" color='black' className={classes.control}>
                Send message
              </Button>
            </Group>
            {notification}
          </div>
        </form>
      </div>
    </Paper>
  );
}