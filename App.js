import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Modal,
    Pressable,
    ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const XP_PER_LEVEL = 100;
const XP_PER_ACTION = 10;

/**
 * FocusTimer Component
 * Açıklama: Pomodoro / Odaklanma asistanı için sayaç bileşeni.
 */
const FocusTimer = ({ timeLeft, isActive, toggleTimer, isBreak }) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <View style={[styles.timerContainer, isBreak && styles.timerContainerBreak]}>
            <Text style={styles.timerTitle}>
                {isBreak ? '☕ Mola Zamanı' : '💻 Odak Süresi'}
            </Text>
            <Text style={styles.timerDisplay}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>
            <TouchableOpacity
                style={[styles.timerButton, isActive && styles.timerButtonActive]}
                onPress={toggleTimer}
            >
                <Text style={styles.timerButtonText}>
                    {isActive ? 'Durdur' : 'Başlat'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

/**
 * ProgressBar Component
 * Açıklama: Seviye atlamak için ne kadar XP kaldığını görselleştirir.
 */
const ProgressBar = ({ xp }) => {
    const progressPercentage = `${(xp / XP_PER_LEVEL) * 100}%`;
    return (
        <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressText}>Gelişim</Text>
                <Text style={styles.progressText}>{xp} / {XP_PER_LEVEL} XP</Text>
            </View>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: progressPercentage }]} />
            </View>
        </View>
    );
};

/**
 * MoodDisplay Component
 * Açıklama: React.memo kullanılarak sadece mood, level veya streak değiştiğinde render edilmesi sağlandı.
 */
const MoodDisplay = React.memo(({ mood, level, streak, advice, onHistoryPress }) => (
    <View style={styles.displayContainer}>
        <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.levelBadge}>{level}</Text>
                {streak >= 3 && (
                    <Text style={styles.streakBadge}>🔥 {streak}x Combo!</Text>
                )}
            </View>
            <TouchableOpacity style={styles.historyBtn} onPress={onHistoryPress}>
                <Text style={styles.historyBtnText}>🗓️ Günlük</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.title}>Geliştirici Mood Takipçisi</Text>
        <View style={styles.moodCard}>
            <Text style={styles.moodSubtitle}>Şu Anki Modum</Text>
            <Text style={styles.moodText}>{mood}</Text>
            {advice ? (
                <Text style={styles.adviceText}>{advice}</Text>
            ) : null}
        </View>
    </View>
));

/**
 * MoodButton Component
 * Açıklama: React.memo ile gereksiz render'lardan kaçınıldı (Production Ready).
 */
const MoodButton = React.memo(({ mood, onPress, isSelected, hasGlow }) => (
    <TouchableOpacity
        activeOpacity={0.6}
        style={[
            styles.button,
            isSelected && styles.buttonSelected,
            hasGlow && styles.buttonGlow
        ]}
        onPress={() => onPress(mood)}
    >
        <Text style={[
            styles.buttonText,
            isSelected && styles.buttonTextSelected,
            hasGlow && isSelected && styles.buttonTextGlow
        ]}>{mood}</Text>
    </TouchableOpacity>
));

export default function App() {
    const [seciliMood, setSeciliMood] = useState('Henüz seçilmedi');
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);

    // Yeni: Geçmiş (History) ve Tavsiye (Advice) Stateleri
    const [logs, setLogs] = useState([]);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [advice, setAdvice] = useState('');

    // RPG Yetenekleri (Stats) ve Kritik Vuruş
    const [stats, setStats] = useState({ speed: 0, int: 0, stamina: 0, mental: 0 });
    const [isCriticalHit, setIsCriticalHit] = useState(false);

    // Yeni: Timer (Pomodoro / Odak) Stateleri
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isBreakSession, setIsBreakSession] = useState(false);

    const moodlar = [
        '🚀 Kod Canavarı',
        '☕ Kahve Lazım',
        '🤯 Debug Çıkmazı',
        '😴 Shift Bitti'
    ];

    // Akıllı tavsiyeler (Smart Advice)
    const getAdviceForMood = (mood) => {
        switch (mood) {
            case '🚀 Kod Canavarı': return 'Müthişsin! Flow halindesin, kesintilere izin verme.';
            case '☕ Kahve Lazım': return 'Kısa molalar uzun vadeli verimi artırır. Gözlerini dinlendir.';
            case '🤯 Debug Çıkmazı': return 'Biraz uzaklaş. Su iç ve "Pompodoro" tekniğini veya Rubber Duck yöntemini dene.';
            case '😴 Shift Bitti': return 'Bugün dünyayı kurtardın. Git dinlen, yarın zihnin daha açık kod yazacaksın.';
            default: return '';
        }
    };

    // Zamanlayıcı (Timer) Efekti
    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerActive) {
            setIsTimerActive(false);
            // Burada sürenin bittiğine dair bir ses veya bildirim eklenebilir
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const toggleTimer = () => setIsTimerActive(!isTimerActive);

    // useCallback: Gereksiz fonksiyon oluşturulmasını (memory allocation) ve alt component re-render'larını önler.
    const handleMoodSelect = useCallback((mood) => {
        if (mood === seciliMood) return;

        setSeciliMood(mood);

        let currentStreak = streak;
        // Sadece üretken modlar seriyi (comboyu) devam ettirir / artırır.
        if (mood === '🚀 Kod Canavarı' || mood === '🤯 Debug Çıkmazı') {
            currentStreak += 1;
        } else {
            currentStreak = 0; // Seri bozulur!
        }
        setStreak(currentStreak);

        setAdvice(getAdviceForMood(mood));

        // Mooda göre zamanlayıcıyı (Focus Asistanı) ayarla
        setIsTimerActive(false);
        if (mood === '🚀 Kod Canavarı') {
            setTimeLeft(50 * 60); // 50 dakika Fokus
            setIsBreakSession(false);
        } else if (mood === '☕ Kahve Lazım') {
            setTimeLeft(15 * 60); // 15 dakika Mola
            setIsBreakSession(true);
        } else if (mood === '🤯 Debug Çıkmazı') {
            setTimeLeft(25 * 60); // 25 Dakika Pompodoro Debug
            setIsBreakSession(false);
        } else {
            setTimeLeft(0); // Odak modu gerekmiyor
        }

        // Günlüğe kaydet (Veri odaklı karar için)
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLogs(prevLogs => [{ id: Date.now().toString(), mood, time: timeString }, ...prevLogs]);

        // Kritik Vuruş (%15 Şans)
        const isCrit = Math.random() < 0.15;
        setIsCriticalHit(isCrit);

        // Odak Çarpanı (Combo Multiplier)
        const isMultiplierActive = currentStreak >= 3;
        const baseXp = isCrit ? 30 : XP_PER_ACTION;
        const gainedXp = isMultiplierActive ? baseXp * 2 : baseXp;

        // Yetenek Artışları (RPG Stats)
        setStats(prev => {
            const newStats = { ...prev };
            if (mood === '🚀 Kod Canavarı') newStats.speed += 1;
            if (mood === '🤯 Debug Çıkmazı') newStats.int += 1;
            if (mood === '☕ Kahve Lazım') newStats.stamina += 1;
            if (mood === '😴 Shift Bitti') newStats.mental += 1;
            return newStats;
        });

        const newXp = xp + gainedXp;
        if (newXp >= XP_PER_LEVEL) {
            setXp(newXp - XP_PER_LEVEL); // XP taştıysa sıfırlamak yerine artanı ekler
            setLevel(prev => prev + 1);
            setShowLevelUpModal(true);
        } else {
            setXp(newXp);
        }
    }, [seciliMood, xp, level, streak]);

    const getContainerStyle = () => {
        let backgroundColor = '#121212';

        switch (seciliMood) {
            case '🚀 Kod Canavarı': backgroundColor = '#0F1C2E'; break;
            case '☕ Kahve Lazım': backgroundColor = '#251E18'; break;
            case '🤯 Debug Çıkmazı': backgroundColor = '#2D1414'; break;
            case '😴 Shift Bitti': backgroundColor = '#181525'; break;
            default: break;
        }

        return [styles.container, { backgroundColor }];
    };

    const isGlowActive = streak >= 3;

    // Dinamik Profil (Title) Belirleme
    const getDynamicTitle = () => {
        const { speed, int, stamina, mental } = stats;
        const maxStat = Math.max(speed, int, stamina, mental);

        let titleName = 'Çaylak';
        if (maxStat > 0) {
            if (maxStat === speed) titleName = '⚡ 10x Ninja';
            else if (maxStat === int) titleName = '🧠 Çözüm Mimarı';
            else if (maxStat === stamina) titleName = '☕ Kafein Bağımlısı';
            else titleName = '🛡️ Zen Ustası';
        }
        return `Lv.${level} ${titleName}`;
    };

    const currentTitle = getDynamicTitle();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={getContainerStyle()}>
                <StatusBar barStyle="light-content" />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View style={styles.innerContainer}>

                        <MoodDisplay
                            mood={seciliMood}
                            level={currentTitle}
                            streak={streak}
                            advice={advice}
                            onHistoryPress={() => setShowHistoryModal(true)}
                        />

                        {/* RPG Stats Container */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statColumn}>
                                <Text style={styles.statText}>⚡ Hız: <Text style={styles.statValue}>{stats.speed}</Text></Text>
                                <Text style={styles.statText}>🧠 Zeka: <Text style={styles.statValue}>{stats.int}</Text></Text>
                            </View>
                            <View style={styles.statColumn}>
                                <Text style={styles.statText}>🔋 Enerji: <Text style={styles.statValue}>{stats.stamina}</Text></Text>
                                <Text style={styles.statText}>🛡️ Akıl S.: <Text style={styles.statValue}>{stats.mental}</Text></Text>
                            </View>
                        </View>

                        {/* Pomodoro Timer (Eğer Süre Varsa Görünür) */}
                        {timeLeft > 0 && (
                            <FocusTimer
                                timeLeft={timeLeft}
                                isActive={isTimerActive}
                                toggleTimer={toggleTimer}
                                isBreak={isBreakSession}
                            />
                        )}

                        <ProgressBar xp={xp} />

                        {isCriticalHit && (
                            <Text style={styles.criticalHighlight}>💥 CRITICAL HIT! (+{30 * (streak >= 3 ? 2 : 1)} XP)</Text>
                        )}

                        <View style={styles.buttonContainer}>
                            {moodlar.map((mood) => (
                                <MoodButton
                                    key={mood}
                                    mood={mood}
                                    isSelected={seciliMood === mood}
                                    hasGlow={isGlowActive && seciliMood === mood}
                                    onPress={handleMoodSelect}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Level Up Modal */}
                <Modal
                    transparent
                    visible={showLevelUpModal}
                    animationType="fade"
                    onRequestClose={() => setShowLevelUpModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalIcon}>🏆</Text>
                            <Text style={styles.modalTitle}>TEBRİKLER!</Text>
                            <Text style={styles.modalMessage}>
                                Yeni Unvan: <Text style={styles.modalLevelHighlight}>{currentTitle}</Text>
                            </Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => setShowLevelUpModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Harika!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* History (Günlük) Modal */}
                <Modal
                    transparent
                    visible={showHistoryModal}
                    animationType="slide"
                    onRequestClose={() => setShowHistoryModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.historyModalContent}>
                            <Text style={styles.historyModalTitle}>🗓️ Günlük Logların</Text>
                            <Text style={styles.historyModalSubtitle}>Ne zaman üretken, ne zaman stresli oldun?</Text>

                            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                                {logs.length === 0 ? (
                                    <Text style={styles.historyEmptyText}>Henüz bir mod kaydetmedin. Kodlamaya başla!</Text>
                                ) : (
                                    logs.map((log) => (
                                        <View key={log.id} style={styles.historyItem}>
                                            <Text style={styles.historyItemTime}>{log.time}</Text>
                                            <Text style={styles.historyItemMood}>{log.mood}</Text>
                                        </View>
                                    ))
                                )}
                            </ScrollView>

                            <Pressable
                                style={[styles.modalButton, { marginTop: 16 }]}
                                onPress={() => setShowHistoryModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Kapat</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'space-evenly', // Orantılı boşluklar
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    displayContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    historyBtn: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    historyBtnText: {
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: '600',
    },
    levelBadge: {
        color: '#34D399', // Zümrüt Yeşili
        backgroundColor: 'rgba(52, 211, 153, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: 'bold',
        fontSize: 14,
        overflow: 'hidden',
    },
    streakBadge: {
        color: '#FBBF24', // Altın Sarısı
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: 'bold',
        fontSize: 14,
        overflow: 'hidden',
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 20,
        letterSpacing: 0.5,
        opacity: 0.95,
        textAlign: 'center',
    },
    moodCard: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 12,
    },
    moodSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 10,
        fontWeight: '600',
    },
    moodText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#F9FAFB',
        marginBottom: 12,
    },
    adviceText: {
        fontSize: 14,
        color: '#A78BFA', // Soft Mor
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: 20,
        marginTop: 4,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(167, 139, 250, 0.2)',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statColumn: {
        flex: 1,
        gap: 6,
    },
    statText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    statValue: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600',
    },
    progressBarBackground: {
        height: 6,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    timerContainer: {
        width: '100%',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Soft Mavi
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    timerContainerBreak: {
        backgroundColor: 'rgba(251, 191, 36, 0.1)', // Soft Sarı/Turuncu (Mola)
        borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    timerTitle: {
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timerDisplay: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 12,
        fontFamily: 'monospace', // Dijital saat görünümü
    },
    timerButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    timerButtonActive: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)', // Durdur Tipi Kırmızı
        borderColor: 'rgba(239, 68, 68, 0.5)',
    },
    timerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#60A5FA', // Canlı mavi
        borderRadius: 3,
    },
    criticalHighlight: {
        color: '#FBBF24', // Altın Sarısı
        fontWeight: '900',
        fontSize: 17,
        marginBottom: 16,
        textShadowColor: 'rgba(251, 191, 36, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
        textAlign: 'center',
        letterSpacing: 1,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12, // Butonlar arası boşluk daraltıldı
        paddingBottom: 20, // En alta dayandığında boşluk olsun diye
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 14, // Butonlar biraz küçültüldü
        paddingHorizontal: 20,
        width: '100%',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.02)',
    },
    buttonSelected: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderColor: 'rgba(255,255,255,0.25)',
        transform: [{ scale: 1.02 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonGlow: {
        shadowColor: '#60A5FA', // Mavi glow efekti
        shadowOpacity: 1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 0 },
        elevation: 15,
        borderColor: 'rgba(96, 165, 250, 0.5)',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
    },
    buttonText: {
        fontSize: 17,
        color: '#9CA3AF',
        fontWeight: '500',
        letterSpacing: 0.4,
    },
    buttonTextSelected: {
        color: '#F9FAFB',
        fontWeight: 'bold',
    },
    buttonTextGlow: {
        color: '#93C5FD',
        textShadowColor: 'rgba(147, 197, 253, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#1E293B',
        width: '100%',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    modalIcon: {
        fontSize: 55,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: 1,
    },
    modalMessage: {
        fontSize: 16,
        color: '#CBD5E1',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    modalLevelHighlight: {
        color: '#34D399',
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    historyModalContent: {
        backgroundColor: '#1E293B',
        width: '100%',
        maxHeight: '80%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 20,
    },
    historyModalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    historyModalSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 20,
        textAlign: 'center',
    },
    historyList: {
        width: '100%',
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    historyItemTime: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    historyItemMood: {
        color: '#F9FAFB',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyEmptyText: {
        color: '#9CA3AF',
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 20,
        marginBottom: 20,
    }
});
