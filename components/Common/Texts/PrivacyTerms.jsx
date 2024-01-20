import React, { useContext } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import theme, {ThemeContext} from '@xcoolsports/constants/theme';
import Container from '@xcoolsports/components/Common/Container';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    header: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 10,
    },
    title: {
        fontWeight: 'bold',
        paddingVertical: 10
    },
    paragraphLine: {
        paddingVertical: 10
    }
});

const PrivacyTerms = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const theme = useContext(ThemeContext);

    return <Container 
            header={{ 
                title: `${t('隐私政策')}`, 
                headerTitle: { showTitle: true }, 
                headerLeft: { onPress: navigation.goBack },
                headerRight: {},
            }}
        >
        <ScrollView style={styles.container}>
            <Text style={[styles.header, {color: theme.text_color}]}>《顽酷隐私政策》</Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                用户的信任对我们非常重要, 我们深知个人信息对您的重要性, 我们将按照法律法规要求, 采取相应安全保护措施, 尽力保护您的个人信息安全可控。
                鉴于此, 顽酷手机应用App (以下简称为“顽酷”）的开发者山东舜达融创互联网科技有限责任公司（以下简称为“顽酷”或“我们”）制订《本隐私权政策》（以下简称为“本政策/本隐私政策”）并提醒您：
                在使用顽酷的产品和服务前，请您务必仔细阅读并透彻理解本《隐私政策》（以下简称为“本政策”）。
                一旦您选择使用或继续使用，即表示您认可并接受本政策现有内容及其可能随时更新的内容，同意我们按照本政策收集、使用、披露、储存和分享，或以其他方式运用您的相关信息。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 一、关于信息收集 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷会通过如下方式收集与您有关的信息。如果您不提供相关信息，无法注册成为我们的用户或无法享受我们的某些服务，或者无法达到相关服务拟达到的效果。
                1、您提供的信息:
                    为了顺利的为您提供相关服务，顽酷会收集您在顽酷输入的或者以其他方式提供给我们的所有信息，包括：
                    1) 您在注册账户时提供的姓名、电话号码、性别、微信名称、微信号等；
                    2) 您在预订活动报名时提供的预定人和联系人的姓名、性别、证件号码、电子邮箱等信息；如您为其他人预订商品或服务，您需要按照提示提供该实际使用商品或接受服务方的信息，并且您需要确保您已经取得该人的同意，并确保其已知晓并接受本隐私政策。
                    3) 您通过顽酷的服务向第三方提供的共享信息，以及您使用我们的服务时所储存的信息。
                2、我们获取的您的信息
                    1) 授权登录
                    我们可能经您同意后向第三方共享您的账户信息（头像、昵称及其他页面提示的信息），使您可以便捷地实现第三方账户的注册或登录。
                    此外，我们可能会根据您的授权从第三方处获取您的第三方账户信息，并与您的顽酷账户进行绑定，使您可通过第三方账户直接登录、使用我们的产品及/或服务。
                    我们需要您的授权获取地理位置权限，用于活动记录打卡服务。我们将在您授权同意的范围内使用您的相关信息。
                    2) 日志信息
                    您使用服务时顽酷收集如下信息: 日志信息, 指您使用我们的服务时, 系统会通过cookies或其他方式自动采集的技术信息, 包括但不限于: 
                    IP地址信息、硬件设备或软件信息、SDK或API版本、平台、时间戳、应用标识符、应用程序版本、应用分发渠道、iOS供应商标识符(IDFV)、iOS广告标识符(IDFA)、安卓广告主标识符、
                    网卡(MAC)地址、国际移动设备识别码(IMEI)、设备型号、终端制造厂商、终端设备操作系统版本、会话启动/停止时间、语言所在地、移动网络/国家代码、时区和网络状态(WiFi等)、硬盘、CPU和电池使用情况、应用安装列表或运行中的进程信息、
                    IP地址、位置信息(指您开启设备定位功能并使用我们基于位置提供的相关服务时, 收集的有关您位置的信息), 等用于第三方SDK调用, 数据分析改进。
                    3) Mapbox地图定位
                    我们的产品集成Mapbox地图定位, SDK为了向您提供【基于位置的相关】功能/服务。在向您提供【定位】功能/服务时, 【Mapbox地图SDK】需要收集、使用您的【设备信息、位置信息、WLAN及其他传感器信息】。
                    4) 互动功能
                    如果您使用发布图片、视频，点赞，收藏，举报, 定位，约活动等功能，则需要注册/登录（登录即代表您注册成为顽酷的用户）顽酷，我们将根据您注册/登录的方式，收集以下个人信息：
                        1. 手机号码，是您选择使用手机号码注册/登录时，主动向我们提供的个人信息。同时，我们将通过发送短信验证码的方式来验证您的账户是否有效。
                        您还可以通过手机号码找回、修改账号密码。您还可以自主选择是否在您的“个人资料”中提供您的生日等个人信息，以此更好的展示自己。
                        2. 第三方应用账号(微信、Apple)和昵称、头像、性别、所在国家、省市信息（请以授权登录界面显示的信息为准), 是您选择使用第三方账号注册/登录, 并授权顽酷读取您在该第三方账号注册的上述信息。
                        如果您不提供这些信息，则您无法注册/登录我们产品，且无法使用需注册/登录的功能，但不会影响您正常使用无需注册/登录的功能。
                    5) 相机权限
                    您在使用发布图片、视频功能时，我们需申请调用您的相机权限、相册权限、闪光灯权限以及麦克风权限，如果您拒绝调用，将无法成功保存、发布视频，但不影响其它无需该权限的功能。
                    6) 官方认证
                    如果您需要官方认证等功能时，从顽酷的品质保障及其他用户的安全等方面综合考虑，您需要提供身份证或者公司营业执照等信息，如果您拒绝给予这些信息，将无法成功认证，但不影响其它无需该权限的功能。
                    7) 电商支付
                    获取个人信息类型或权限: 微信或支付宝账号、设备型号、IP地址、设备软件版本信息、设备识别码、唯一设备标识符IMEI、位置信息、网络使用习惯以及其他与服务相关的日志信息。
                3、其他合法途径收集您的信息
                我们还会从其他合法来源收到关于您的信息并且将其加入我们的信息库，例如其他方使用我们的服务时所提供有关您的共享信息等等。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 二、关于信息使用 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷利用收集的信息来提供、维护、保护和改进服务，同时开发新的服务为用户创造更好的体验，并提高我们的总体服务品质。
                您理解并同意，顽酷可在如下情形使用您的信息：
                    1) 为确保我们向您提供的产品和服务的安全性，用于身份验证、客户服务、安全防范、诈骗监测、存档和备份用途时；
                    2) 向您提供服务特别是定制服务时，以及帮助我们设计改善我们现有服务时；
                    3) 向您提供相关的广告、评估我们服务中的广告和其他促销及推广活动的效果，并加以改善时；
                    4) 顽酷会对产品使用情况进行统计，并会与公众分享这些统计信息，以展示我们服务的整体使用趋势时；
                    5) 我们需要使用您的信息来处理和解决法律纠纷时；
                    6) 您授权并同意接受我们向您的电子邮件、手机、通信地址等发送商业信息，包括不限于最新的产品信息、促销信息等；
                    7) 我们在必要时，例如因系统维护而暂停部分服务时，向您发出与服务有关的公告。您理解并认可您无法取消这些公告，因为这些公告与服务有关、性质不属于商业推广。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 三、关于信息披露 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                除非事先获得您的授权或本《隐私政策》约定外，顽酷不会将这些信息对外公开或向顽酷之外的第三方提供。
                您理解并同意，顽酷可在如下情形依法披露您的个人信息：
                    1) 事先获得用户的明确授权；
                    2)  您使用了必须披露个人信息才能正常使用的顽酷或其合作商提供的产品或服务，例如必须实名购买保险时提供的身份信息；
                    3) 根据法律、法规要求或政府主管部门的强制性要求，或者为了维护公共利益；
                    4) 为维护顽酷的合法权益，或顽酷服务的正常运营，例如查找、预防、处理欺诈或安全方面的问题；
                    5) 我们会向第三方（包括但不限于关联公司、合作伙伴等）共享您的订单信息、账户信息、设备信息以及位置信息等，以保障为您提供的服务顺利完成。但我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息；我们不会向任何机构披露任何用以识别用户的个人身份的资料，但从用户的用户名或其它可披露资料分析得出的资料不受此限。
                    6) 其他符合法律，以及符合顽酷《服务协议》或其他相关协议、规定、指引的情形。
                    7) 顽酷也会使用您的信息，通过各种方式向您发送营销信息，提供或推广我们或合作方提供的产品和服务。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 四、关于敏感信息 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                某些个人信息因其特殊性会被认为是敏感信息，例如您的种族、宗教、个人健康和医疗信息等。相比其他个人信息，敏感个人信息受到更加严格的保护。
                请注意，您在使用我们的服务时所提供、上传或发布的内容和信息，例如有关您在论坛中发布的照片等信息，可能会泄露您的敏感个人信息。
                您需要谨慎地考虑，是否在使用我们的服务时披露相关敏感个人信息。
                您同意按本《隐私政策》来处理您的敏感个人信息。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 五、关于信息存储 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                所收集的用户信息和资料将保存在顽酷及其关联公司的服务器上，或顽酷委托机构的服务器上。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 六、关于账号注销 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                你可以在【我】-【注销账号】中进行帐号注销。你知悉并理解，
                注销帐号的行为是不可逆的行为，当你注销帐号后，我们将在五个工作日内或法律法规所要求的时限内完成核查和处理。
                当完成账号注销后，我们将停止为你提供相应的产品及服务，对你的相关个人数据进行删除或进行匿名化处理，但法律法规另有规定的除外。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 七、关于外部链接 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷的产品或服务中含有到其他网站的链接。顽酷对那些网站的隐私保护措施不负任何责任。
                我们在任何需要的时候增加商业伙伴或合作品牌的网页链接。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 八、公开发布信息 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                您发布的内容或评论将被显示在公共区域，对任何用户来说是公开的。
                请注意所有在这些场所公开的信息会被公众阅读，请您在决定公布您的个人信息前仔细考虑。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 九、信息安全 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷尽力保护您的信息安全, 以防信息的丢失、不当使用、未经授权的披露等, 我们将为此采取合理的预防措施, 使用符合行业标准的加密技术来保护您在使用本服务中涉及的数据。
                但是, 您理解并确认, 网络环境中始终存在各种信息泄漏的风险, 我们无法完全保证互联网数据100%的安全。
                如果出现出数据安全问题，将会由您个人承担全部后果。因此，您应采取积极措施保证个人信息的安全，例如定期修改账号密码，不将自己的账号密码等个人信息透露给他人。
                如果顽酷得知有安全系统漏洞，我们在必要时通过您预留的联系方式与你联系或在我们的网络系统上发布通知，并提供可能的保护措施。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 十、未成年人信息保护 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷非常重视对未成年人信息的保护。
                若您是18周岁以下的未成年人, 在使用顽酷的产品和/或服务前，应事先取得您的家长或法定监护人的同意，并请要求您的父母或监护人阅读本《隐私政策》。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 十一、关于变更 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                顽酷将根据法律、法规或政策，或顽酷产品和服务的变化以及技术的更新，或其他顽酷认为合理的原因，对本《隐私政策》进修改变更。
                变更以网站/App公告、或用户通知等合适的形式告知用户, 或在网页中显著的位置予以发布。
                若您不接受变更后条款的，应立即停止使用，若您在本《隐私政策》变更后继续使用的，视为接受修订后的所有条款。
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 十二、适用范围 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                除另有明确约定外，我们所有的服务均适用本《隐私政策》。
                针对某些特定服务的特定隐私政策，将更具体地说明我们在该等服务中如何使用您的信息。
                该特定服务的隐私政策构成本《隐私政策》的一部分。 
            </Text>

            <Text style={[styles.title, {color: theme.text_color}]}> 十三、联系我们 </Text>
            <Text style={[styles.paragraphLine, {color: theme.text_color}]}>
                如果你对个人信息保护问题有投诉、建议、疑问, 你可以将问题发送至(customerservice@xcoolsports.com)
                我们将尽快审核所涉问题，并在验证你的用户身份后的十五个工作日内回复。
            </Text>
        </ScrollView>
    </Container>
}

export default PrivacyTerms;
