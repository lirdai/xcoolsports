import React, {useContext} from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'

import {ThemeContext} from '@xcoolsports/constants/theme';
import Image from '@xcoolsports/components/utils/Image/index';
import urlConstants from '@xcoolsports/constants/urls';
import templateConstants from '@xcoolsports/constants/templateConstants';
import Container from '@xcoolsports/components/Common/Container';
import styles from '@xcoolsports/components/LoginUserTabs/Notifications/style';
import Loading from '@xcoolsports/components/Common/Pages/Loading';
import { selectCurrentUser, api } from '@xcoolsports/data';
import SecondaryContainedButton from '@xcoolsports/components/utils/Buttons/SecondaryContainedButton';
import SecondaryOutlinedButton from '@xcoolsports/components/utils/Buttons/SecondaryOutlinedButton';

const TicketDetail = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { ticketID } = route.params;
    const currentUser = useSelector(selectCurrentUser);
    const theme = useContext(ThemeContext);

    const [modifyTicket] = api.endpoints.modifyTicket.useMutation();
    const [certifyUser] = api.endpoints.certifyUser.useMutation();

    const { data: ticket } = api.endpoints.getTicket.useQuery({ ticketID }, { skip: ticketID === undefined });
    const { data: replys } = api.endpoints.getTicketList.useQuery({ page: 1, parentID: ticketID }, { skip: ticketID === undefined });

    const handleStatus = async (status) => {
        const newObject = {
          assignee: currentUser.id,
          status,
          reason: '',
        };
    
        await modifyTicket({ ticketID, body: newObject });
        if (ticket.ticket_type === 'CERTIF') {
            if (status === 'DONE') {
                await certifyUser({ username: ticket.author.username, body: { verified: 'true' } })
            } else {
                await certifyUser({ username: ticket.author.username, body: { verified: 'false' } });
            }
        }
    };

    return (
        <Container 
            header={{ 
                title: `${t('处理页面')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
            <Loading isLoading={!ticket || !replys} />
            {(ticket && replys) &&
                <ScrollView showsVerticalScrollIndicator={false} vertical style={{ margin: theme.v_spacing_xl }}>
                    <Pressable 
                        hitSlop={20}
                        onPress={() => {
                            ticket?.author?.username 
                                ? navigation.push(`${t('看用户')}`, { usernameURL: ticket.author.username })
                                : null
                        }}
                        style={styles.horizontalTitle}
                    >
                        <Image 
                            containerStyle={[styles.avatar, {backgroundColor: theme.fill_base}]}
                            isSelectedUploading={false}
                            editMode={false}
                            showloading={false}
                            source={ticket.author.avatar ? { uri :`${urlConstants.images}/${ticket.author.avatar}` } : require('@xcoolsports/static/avatar.jpg') }
                            resizeMode="cover" 
                        />

                        <View style={styles.title}>
                            <Text style={{color: theme.text_color}}>{ ticket.author.nickname }</Text>

                            {ticket.ticket_type === "CERTIF" && <Text style={{color: theme.text_color}}>{ticket.author.user_type === "PERSON" ? `${t('个人')}`: `${t('企业')}`} {t(templateConstants.notification_type['TICKET'][ticket.ticket_type])}: { ticket.author.certification }</Text>}
                            {ticket.ticket_type === "CERTIF" && <Text style={{color: theme.text_color}}>{t('手机后四位')}: { ticket.author.phone_number }</Text>}
                            {ticket.ticket_type === "REPUSER" && <Text style={{color: theme.text_color}}>{t(templateConstants.notification_type['TICKET'][ticket.ticket_type])}</Text>}
                            {ticket.ticket_type === "REPTPC" && <Text style={{color: theme.text_color}}>{t(templateConstants.notification_type['TICKET'][ticket.ticket_type])}: { ticket.title }</Text>}
                            {ticket.ticket_type === "FEEDBK" && <Text style={{color: theme.text_color}}>{t(templateConstants.notification_type['TICKET'][ticket.ticket_type])}</Text>}
                            {ticket.ticket_type === "REFUND" && <Text style={{color: theme.text_color}}>{t(templateConstants.notification_type['TICKET'][ticket.ticket_type])}</Text>}
                        </View>
                    </Pressable>

                    <View style={{ marginVertical: theme.v_spacing_xl }}>
                        {(ticket.ticket_type === "CERTIF" || ticket.ticket_type === "REPUSER") &&
                            <Pressable 
                                hitSlop={20}
                                onPress={() => {
                                    ticket?.related_data?.selfID 
                                        ? navigation.push(`${t('看用户')}`, { usernameURL: ticket.related_data.selfID })
                                        : null
                                }}
                            > 
                                <Text style={{color: theme.text_color}}>{t('点击查看')}</Text>
                            </Pressable>
                        } 

                        {(ticket.ticket_type === "REPTPC") && 
                            <Pressable 
                                hitSlop={20}
                                onPress={() => navigation.push(`${t('看日记')}`, { topicId: ticket.related_data.topicId, eventId: ticket.related_data.eventId, commentId: ticket.related_data.commentId })}
                            > 
                                <Text style={{color: theme.text_color}}>{t('点击查看')}</Text>
                            </Pressable>
                        }

                        {ticket.ticket_type === "FEEDBK" && 
                            <View>
                                <Text style={{color: theme.text_color}}>{t('品牌')}: {ticket?.related_data?.device?.brand}</Text>
                                <Text style={{color: theme.text_color}}>{t('款式')}: {ticket?.related_data?.device?.designName}</Text>
                                <Text style={{color: theme.text_color}}>{t('年份')}: {ticket?.related_data?.device?.deviceYearClass}</Text>
                                <Text style={{color: theme.text_color}}>{t('生产商')}: {ticket?.related_data?.device?.manufacturer}</Text>
                                <Text style={{color: theme.text_color}}>{t('型号ID(iOS)')}:{ticket?.related_data?.device?.modelId}</Text>
                                <Text style={{color: theme.text_color}}>{t('型号')}: {ticket?.related_data?.device?.modelName}</Text>
                                <Text style={{color: theme.text_color}}>{t('操作系统')}: {ticket?.related_data?.device?.osName} {ticket?.related_data?.device?.osVersion} {ticket?.related_data?.device?.osBuildId}</Text>
                                <Text style={{color: theme.text_color}}>{t('SDK等级(Android)')}: {ticket?.related_data?.device?.platformApiLevel}</Text>
                                <Text style={{color: theme.text_color}}>{t('手机内存')}: {ticket?.related_data?.device?.totalMemory}</Text>
                                <Text style={{color: theme.text_color}}>{t('屏幕尺寸')}: {ticket?.related_data?.device?.windowWidth} (w) x {ticket?.related_data?.device?.windowHeight} (h)</Text>
                            </View>
                        }

                        <Text style={{color: theme.text_color}}>{ticket.content}</Text>
                    </View>

                    <View>
                        {ticket.status !== 'OPEN' && (
                            <View>
                                <Text style={{color: theme.text_color}}>{t('查看状态更新')}:</Text> 
                                {replys.topics.map((reply) => <Text style={{color: theme.text_color}} key={reply.id}>{reply.content}</Text>)}
                            </View>
                        )}

                        {ticket.status === 'OPEN' && (
                            <View>
                                <SecondaryOutlinedButton 
                                    buttonFreeStyle={{height: 50, marginTop: 15, marginBottom: 10}} 
                                    onPress={() => { handleStatus('CANCELLED') }}
                                    textFreeStyle={{fontSize: theme.font_size_caption}} 
                                    buttonText={'驳回'} 
                                />

                                <SecondaryContainedButton 
                                    buttonFreeStyle={{height: 50, marginBottom: 15}} 
                                    onPress={() => { handleStatus('DONE') }}
                                    textFreeStyle={{fontSize: theme.font_size_caption}} 
                                    buttonText={'通过'} 
                                />
                            </View>
                        )}
                    </View>
                </ScrollView>
            }
        </Container>
    )
};

export default TicketDetail;
