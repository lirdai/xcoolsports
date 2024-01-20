import React, { useState, useRef, useEffect, useContext } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Header from '@xcoolsports/components/TopicEdit/Header';
import Media from '@xcoolsports/components/TopicEdit/Media';
import Content from '@xcoolsports/components/TopicEdit/Content';
import EventExtra from '@xcoolsports/components/TopicEdit/EventExtra';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import FileUploader from '@xcoolsports/components/utils/FileUploader';
import Container from '@xcoolsports/components/Common/Container';
import getDateFormat from '@xcoolsports/utils/getDateFormat';
import timelist from '@xcoolsports/components/TopicEdit/timelist';
import recursionByDay from '@xcoolsports/utils/recursionByDay';
import recursionByWeek from '@xcoolsports/utils/recursionByWeek';
import recursionByMonth from '@xcoolsports/utils/recursionByMonth';
import CustomErrorBoundary from '@xcoolsports/components/Common/Pages/CustomErrorBoundary';
import iso8601 from '@xcoolsports/utils/ios8601';
import { 
  toastActions, toastTypes, api, selectTopicById, selectEventById,
} from '@xcoolsports/data';

const generateTimeSlots = (startTime, endTime) => {
  const time_slots = [];

  for (let i = startTime; i < (endTime <= startTime ? endTime + 24 : endTime); i += 0.5) {
    time_slots.push(i);
  }

  return time_slots;
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButton: {
    marginVertical: theme.v_spacing_sm,
  },
});

const TopicEdit = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const { topicId, eventId } = route.params || {};
  const isEdit = !Number.isNaN(Number(topicId)) || !Number.isNaN(Number(eventId));
  const flatListRef = useRef();
  const isMounted = useRef(true);
  const theme = useContext(ThemeContext);

  const dispatch = useDispatch();
  const topic = useSelector((state) => selectTopicById(state, topicId));
  const event = useSelector((state) => selectEventById(state, eventId));

  const [createTopic] = api.endpoints.createTopic.useMutation();
  const [createEvent] = api.endpoints.createEvent.useMutation();
  const [updateTopic] = api.endpoints.updateTopic.useMutation();
  const [updateEvent] = api.endpoints.updateEvent.useMutation();
  const [deleteMediaFileById] = api.endpoints.deleteMediaFileById.useMutation();

  // Topic 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [multiMedia, setMultiMedia] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState([]);
  const [submitLoaing, setSubmitLoading] = useState(false);

  // Event
  const [isEvent, setIsEvent] = useState(false);
  const [isEventDurationFlexible, setIsEventDurationFlexible] = useState(false);
  const [isEventPeopleFlexible, setIsEventPeopleFlexible] = useState(false);
  const [isOnelineDeposit, setIsOnelineDeposit] = useState(false);
  const [isRefundable, setIsRefundable] = useState(false);

  const [priceType, setPriceType] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [currency, setCurrency] = useState('加元');
  const [paymentMethods, setPaymentMethods] = useState(['借记卡或信用卡']);

  const [duration, setDuration] = useState({ days: 0, hours: 0 });  
  const [minDuration, setMinDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);

  const [people, setPeople] = useState(0);
  const [minPeople, setMinPeople] = useState(0);
  const [maxPeople, setMaxPeople] = useState(0);

  const [location, setLocation] = useState("");
  const [longtitude, setLongtitude] = useState();
  const [latitude, setLatitude] = useState();
  const [onChange, setOnChange] = useState({ location: true, oldPrice: true, price: true, deposit: true });

  const [date, setDate] = useState(getDateFormat(new Date()));
  const [recursionEndDate, setRecursionEndDate] = useState(getDateFormat(new Date()));
  const [fromTime, setFromTime] = useState(timelist[16]);
  const [endTime, setEndTime] = useState(timelist[18]);
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState([]);
  const [isRecursion, setIsRecursion] = useState(false);
  const [recursionNumber, setRecursionNumber] = useState("1");
  const [recursionFrequency, setRecursionFrequency] = useState("日");
  const [recursionForAWeek, setRecursionForAWeek] = useState({
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
  });

  const isDisabledSubmit = ({
    multiMedia, title, content, isEventDurationFlexible, minDuration, maxDuration, 
    duration, priceType, deposit, price, oldPrice, paymentMethods, isOnelineDeposit, 
    isEventPeopleFlexible, minPeople, maxPeople, people, currency,
    longtitude, latitude, tags, events, onChange, isEvent, location, markedDates, 
  }) => {
    const isMediaBad = (multiMedia.length === 0) && '至少上传一张照片或视频';
    const isTitleBad = (title === "") && '标题不能为空';
    const isContentBad = (content === '') && '正文不能为空';
    const isDurationBad = (isEventDurationFlexible ? (minDuration === 0 || maxDuration === 0 || maxDuration < minDuration) : (duration["days"] * 24 + duration["hours"] === 0)) && '时长不合理';
    const isPriceBad = (priceType === '' || price === "" || oldPrice === '' || !onChange["price"] || !onChange["oldPrice"]) && '必须填写价格类型, 现价, 原价';
    const isOnelineDepositBad = (isOnelineDeposit && (deposit === "" || currency.length === 0 || paymentMethods.length === 0 || !onChange["deposit"])) && '线上支付必须填写价格类型, 支付方式, 定金等';
    const isPeopleBad = (isEventPeopleFlexible ? (minPeople === 0 || maxPeople === 0 || maxPeople < minPeople) : (people === 0)) && '人数不合理';
    const isLocationBad = (location === '' || !onChange["location"]) && '地址不合理';
    const isCoordinateBad = (!longtitude || !latitude) && '请搜索地址并点击合适的地址进行验证';
    const isTimeSettingBad = (Object.keys(markedDates).length === 0 || events.length === 0) && '时间设置不合理';
    const isTagsBad = tags.length === 0 && '请选择标签';

    if (isEvent) return isMediaBad || isTitleBad || isContentBad || isTagsBad || isDurationBad || isPriceBad || isOnelineDepositBad || isPeopleBad || isLocationBad || isCoordinateBad || isTimeSettingBad;
    return isMediaBad || isTitleBad || isContentBad || isTagsBad;
  };

  const recursionType = {
    "日": 'BYDAY',
    "周": 'BYWEEK',
    "个月": 'BYMONTH',
    "BYDAY": "日",
    "BYWEEK": '周',
    "BYMONTH": '个月',
  }

  const recursionDays = {
    "日": [],
    "周": Object.entries(recursionForAWeek || { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }).filter(([key, value]) => value === true).map(([key]) => Number(key)),
    "个月": [parseInt(date.split("-")[2])],
  };

  const addMedia = (file) => {
    if (!isMounted.current) return;
    setMultiMedia((prev) => [...prev, ...file]);
  };

  const deleteMedia = async (file) => {
    if (!isMounted.current) return;
  
    if (file.url !== undefined) {
      const response = await deleteMediaFileById({ fileId: file.url });
      if (response.data) {
        setMultiMedia(multiMedia.filter((_f) => _f.url !== file.url));
      }
    } else if (file.file !== undefined) {
      setMultiMedia(multiMedia.filter((_f) => _f?.file?.uri !== file.file?.uri));
    } else {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: '未知错误' }));
    }
  };

  const handleTopicSubmit = async () => {
    const disabledCondition = isDisabledSubmit({
      multiMedia, title, content, isEventDurationFlexible, minDuration, maxDuration, 
      duration, priceType, deposit, price, oldPrice, paymentMethods, isOnelineDeposit, 
      isEventPeopleFlexible, minPeople, maxPeople, people, currency,
      longtitude, latitude, tags, events, onChange, isEvent, location, markedDates, 
    });

    if (multiMedia.filter(_mm => _mm.uploaded === false).length > 0) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '请先上传文件' }));
      return;
    }

    if (disabledCondition) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: disabledCondition }));
      return;
    }

    if (isMounted.current) setSubmitLoading(true);

    const newTopic = {
      title,
      content,
      multimedia: multiMedia.map((f) => ({ url: f.url, mediaType: f.mediaType })),
      public: isPublic,
      tags,
    };

    let response;

    if (isEdit) {
      response = await updateTopic({ id: topicId, body: newTopic });
    } else {
      response = await createTopic(newTopic);
    }

    if (response.data) navigation.replace(`${t('看日记')}`, { topicId: response.data.topic.id });
    if (isMounted.current) setSubmitLoading(false);
  };

  const handleEventSubmit = async () => {
    const disabledCondition = isDisabledSubmit({
      multiMedia, title, content, isEventDurationFlexible, minDuration, maxDuration, 
      duration, priceType, deposit, price, oldPrice, paymentMethods, isOnelineDeposit, 
      isEventPeopleFlexible, minPeople, maxPeople, people, currency,
      longtitude, latitude, tags, events, onChange, isEvent, location, markedDates, 
    });

    if (multiMedia.filter(_mm => _mm.uploaded === false).length > 0) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.WARNING, text: '请先上传文件' }));
      return;
    }

    if (disabledCondition) {
      dispatch(toastActions.showToastAutoRemove({ type: toastTypes.ERROR, text: disabledCondition }));
      return;
    }
    
    if (isMounted.current) setSubmitLoading(true);

    const newEvent = {
      title,
      content,
      multimedia: multiMedia.map((f) => ({ url: f.url, mediaType: f.mediaType })),
      public: isPublic,
      tags,

      is_deposit_required: isOnelineDeposit,
      is_refundable: isRefundable,
      price_type: priceType,     
      old_price: Number(oldPrice),
      price: Number(price),
      deposit: Number(deposit),
      currency,
      payment_methods: paymentMethods,

      duration_type: isEventDurationFlexible ? 'FLEX' : "FIXED",
      duration: isEventDurationFlexible ? undefined : duration,
      min_duration: isEventDurationFlexible ? { days: 0, hours: minDuration } : undefined,
      max_duration: isEventDurationFlexible ? { days: 0, hours: maxDuration } : undefined,
      address: location,
      coordinate: `${longtitude},${latitude}`,
      num_guests: isEventPeopleFlexible ? undefined : people,
      min_guests: isEventPeopleFlexible ? minPeople : undefined,
      max_guests: isEventPeopleFlexible ? maxPeople : undefined,

      first_date: date,
      last_date: recursionEndDate,
      is_recurring: isRecursion,
      time_slots: generateTimeSlots(fromTime.code, endTime.code),
      recur_type: recursionType[recursionFrequency],
      recur_amount: Number(recursionNumber),
      recur_days: recursionDays[recursionFrequency],
    };

    let response;

    if (isEdit) {
      response = await updateEvent({ id: eventId, body: newEvent });
    } else {
      response = await createEvent(newEvent);
    }

    if (response.data) navigation.replace(`${t('看日记')}`, { topicId: response.data.event.topic_id, eventId: response.data.event.id });
    if (isMounted.current) setSubmitLoading(false);
  };

  const fetchOnePost = async () => {
    if (isEdit && isMounted.current) {
      setTitle(topic.title);
      setContent(topic.content);
      setMultiMedia(topic.multimedia);
      setTags(topic.tags);
      setIsPublic(topic.is_public);
      setIsEvent(topic.content_type === 'EVT');

      if (topic.content_type === 'EVT') {
        setIsEventDurationFlexible(event.duration_type === 'FLEX');
        setIsEventPeopleFlexible(event.min_guests !== event.max_guests);
        setPriceType(event.price_type);
        setDuration({ days: Math.floor(iso8601(event.min_duration)/24), hours: iso8601(event.min_duration)%24 });
        setMinDuration(iso8601(event.min_duration));
        setMaxDuration(iso8601(event.max_duration));
        setPeople(event.min_guests);
        setMinPeople(event.min_guests);
        setMaxPeople(event.max_guests);
        setPrice(event.price);
        setLocation(event.location);

        setIsRecursion(event.is_recurring);
        setDate(event.first_date);
        setRecursionEndDate(event.last_date);
        setFromTime(timelist.find((time) => time.code === event.time_slots[0]));
        setEndTime(timelist.find((time) => time.code === (event.time_slots[0] + iso8601(event.max_duration) > 23.5 ? 23.5 : event.time_slots[0] + iso8601(event.max_duration))));
        setRecursionNumber(`${event.recur_amount}`);
        setRecursionFrequency(recursionType[event.recur_type]);

        if (event.recur_type === 'BYWEEK') {
          let recurDaysByWeek = event.recur_days.reduce(function(obj, item) {
            obj[item] = true;
            return obj;
          }, {});
          
          for (var i = 0; i <= 6; i++) {
            if (!(i in recurDaysByWeek)) {
              recurDaysByWeek[i] = false;
            }
          }

          setRecursionForAWeek(recurDaysByWeek);
        }

        setEvents([{
          "date": event.first_date, 
          "start": `${event.first_date} ${timelist.find((time) => time.code === event.time_slots[0]).value}`, 
          "end": `${event.first_date} ${timelist.find((time) => time.code === (event.time_slots[0] + iso8601(event.max_duration) > 23.5 ? 23.5 : event.time_slots[0] + iso8601(event.max_duration))).value}`, 
          "fromTime": timelist.find((time) => time.code === event.time_slots[0]), 
          "endTime": timelist.find((time) => time.code === (event.time_slots[0] + iso8601(event.max_duration) > 23.5 ? 23.5 : event.time_slots[0] + iso8601(event.max_duration))), 
          "title": `${t('可预约时间段')}`,
        }]);

        var startDateString = event.first_date;
        var endDateString = event.last_date;
        var startDateObj = new Date(`${startDateString}T00:00:00.000Z`);
        var endDateObj = new Date(`${endDateString}T00:00:00.000Z`);

        var startYear = startDateObj.getUTCFullYear();
        var endYear = endDateObj.getUTCFullYear();
        var startMonth = startDateObj.getUTCMonth();
        var endMonth = endDateObj.getUTCMonth();
        var startDay = startDateObj.getUTCDate();
        var endDay = endDateObj.getUTCDate();

        var utcStartDate = Date.UTC(startYear, startMonth, startDay);
        var utcEndDate = Date.UTC(endYear, endMonth, endDay);

        if (event.recur_type === 'BYDAY') {
          recursionByDay(utcStartDate, utcEndDate, Number(event.recur_amount), setMarkedDates);
        } else if (event.recur_type === 'BYWEEK') {
          recursionByWeek(utcStartDate, utcEndDate, event.recur_days, setMarkedDates);
        } else if (event.recur_type === 'BYMONTH') {
          recursionByMonth(utcStartDate, utcEndDate, parseInt(event.first_date.split("-")[2]), setMarkedDates);
        }
      }
    }
  }

  useEffect(() => {
    if (topic || event) fetchOnePost();
  }, [isEdit, topic, event]);

  useEffect(() => () => { isMounted.current = false; }, []);

  return (
    <Container
      header={{
        headerLeft: {onPress: navigation.goBack},
        headerRight: {headerRightComponent: <Header isEvent={isEvent} />}
      }}
    >
      <CustomErrorBoundary>
        <View style={styles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
            data={[{id: "Media"}, {id: "Content"}, {id: "EventExtra"}]}
            keyExtractor={item => item.id}
            renderItem={section => {
              if (section.index === 0) return <EventExtra 
                isEvent={isEvent}
                isEventDurationFlexible={isEventDurationFlexible}
                isEventPeopleFlexible={isEventPeopleFlexible}
                isOnelineDeposit={isOnelineDeposit}
                isRefundable={isRefundable}
                duration={duration}
                minDuration={minDuration}
                maxDuration={maxDuration}
                oldPrice={oldPrice}
                price={price}
                deposit={deposit}
                priceType={priceType}
                currency={currency}
                paymentMethods={paymentMethods}
                onChange={onChange}
                people={people}
                minPeople={minPeople}
                maxPeople={maxPeople}
                location={location}
                longtitude={longtitude}
                latitude={latitude}
                date={date}
                fromTime={fromTime}
                endTime={endTime}
                markedDates={markedDates}
                events={events}
                recursionNumber={recursionNumber}
                recursionFrequency={recursionFrequency}
                recursionEndDate={recursionEndDate}
                recursionForAWeek={recursionForAWeek || { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }}
                isRecursion={isRecursion}
                setIsEvent={setIsEvent}
                setIsEventDurationFlexible={setIsEventDurationFlexible}
                setIsEventPeopleFlexible={setIsEventPeopleFlexible}
                setIsOnelineDeposit={setIsOnelineDeposit}
                setIsRefundable={setIsRefundable}
                setDuration={setDuration}
                setMinDuration={setMinDuration}
                setMaxDuration={setMaxDuration}
                setPrice={setPrice}
                setOldPrice={setOldPrice}
                setDeposit={setDeposit}
                setPriceType={setPriceType}
                setCurrency={setCurrency}
                setPaymentMethods={setPaymentMethods}
                setOnChange={setOnChange}
                setPeople={setPeople}
                setMaxPeople={setMaxPeople}
                setMinPeople={setMinPeople}
                setLocation={setLocation}
                setLongtitude={setLongtitude}
                setLatitude={setLatitude}
                setDate={setDate}
                setFromTime={setFromTime}
                setEndTime={setEndTime}
                setMarkedDates={setMarkedDates}
                setEvents={setEvents}
                setRecursionNumber={setRecursionNumber}
                setRecursionFrequency={setRecursionFrequency}
                setRecursionEndDate={setRecursionEndDate}
                setRecursionForAWeek={setRecursionForAWeek}
                setIsRecursion={setIsRecursion}
              />

              if (section.index === 1) return <Media 
                multiMedia={multiMedia} 
                handleAddMedia={addMedia}
                handleDeleteMedia={deleteMedia}
              />

              return <Content 
                title={title} 
                content={content} 
                isPublic={isPublic}
                tags={tags}
                submitLoaing={submitLoaing}
                isEvent={isEvent}
                setTitle={setTitle} 
                setContent={setContent} 
                setIsPublic={setIsPublic}
                setTags={setTags}
                handleTopicSubmit={handleTopicSubmit}
                handleEventSubmit={handleEventSubmit}
                onEdit={() => flatListRef.current.scrollToIndex({ index: 1 })}
              />
            }}
          />

          <FileUploader
            uploadQueue={multiMedia.filter(_mm => _mm.uploaded === false)}
            onProgress={(file, progress) => {if (isMounted.current) setMultiMedia(prev => prev.map(_mm => _mm.file?.uri === file.file.uri ? {...file, progress} : _mm))}}
            onDone={(file, url) => {if (isMounted.current) setMultiMedia(prev => prev.map(_mm => _mm.file?.uri === file.file.uri ? {...file, url, uploaded: true} : _mm))}}
            onError={(file) => {if (isMounted.current) setMultiMedia(prev => prev.map(_mm => _mm.file?.uri === file.file.uri ? {...file, error: true} : _mm))}}
          /> 
        </View>
      </CustomErrorBoundary>
    </Container>
  )
};

export default TopicEdit;


// const onGoBack = () => {
//   if (!isMounted.current) return;
//   if (!isEmpty.current && (!isEdit || isDraft)) {
//     if (!openExitModal) {
//       setOpenExitModal(true);
//     }

//     return;
//   }

//   setOpenExitModal(false);
//   navigation.goBack();
// };

// const onHardwareGoBack = () => {
//   if (!isMounted.current) return;
//   if (!isEmpty.current && (!isEdit || isDraft)) {
//     if (!openExitModal) {
//       setOpenExitModal(true);
//     }
    
//     return true;
//   }

//   setOpenExitModal(false);
//   return false;
// };

// useFocusEffect(useCallback(() => {
//   const backLisener = BackHandler.addEventListener("hardwareBackPress", onHardwareGoBack);
//   return () => backLisener.remove()
// }, []));