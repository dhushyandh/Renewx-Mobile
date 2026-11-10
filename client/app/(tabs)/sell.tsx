import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Screen from "../../src/components/Screen";
import { commerceApi, type CatalogBrand, type CatalogModel } from "../../src/services/api/commerce";
import { useAuthStore } from "../../src/stores/authStore";
import { colors, radius, spacing } from "../../src/theme";

const categories = ["Smartphone", "Laptop", "Tablet", "Audio", "Wearable", "Other"];
const screenOptions = [{ label: "Flawless", value: "flawless" }, { label: "Minor scratches", value: "good" }, { label: "Cracked / damaged", value: "cracked" }];
const bodyOptions = [{ label: "Like new", value: "likenew" }, { label: "Visible wear", value: "fair" }, { label: "Dents / damage", value: "dented" }];
const steps = ["Category", "Brand", "Model", "Variant", "Condition", "Photos", "Pickup", "Quote"];

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[s.choice, selected && s.choiceOn]}><Text style={[s.choiceText, selected && s.choiceTextOn]}>{label}</Text></Pressable>;
}
function Field({ label, value, onChangeText, placeholder, keyboardType, multiline, maxLength }: any) {
  return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} keyboardType={keyboardType} multiline={multiline} maxLength={maxLength} style={[s.input, multiline && s.multiline]} /></View>;
}

export default function SellScreen() {
  const user = useAuthStore(state => state.user);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("Smartphone");
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [models, setModels] = useState<CatalogModel[]>([]);
  const [catalogBusy, setCatalogBusy] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("");
  const [screenCondition, setScreenCondition] = useState("good");
  const [bodyCondition, setBodyCondition] = useState("fair");
  const [switchesOn, setSwitchesOn] = useState(true);
  const [touchWorking, setTouchWorking] = useState(true);
  const [cameraClear, setCameraClear] = useState(true);
  const [batteryHealthy, setBatteryHealthy] = useState(true);
  const [hasBox, setHasBox] = useState(false);
  const [hasCharger, setHasCharger] = useState(false);
  const [hasBill, setHasBill] = useState(false);
  const [conditionNotes, setConditionNotes] = useState("");
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [quote, setQuote] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    let active = true;
    setCatalogBusy(true); setCatalogError(""); setBrands([]); setBrandId(""); setBrand(""); setModel(""); setStorage(""); setModels([]);
    commerceApi.brands(category).then(result => { if (active) setBrands(Array.isArray(result.data) ? result.data : []); })
      .catch(err => { if (active) setCatalogError(err instanceof Error ? err.message : "Unable to load brands."); })
      .finally(() => { if (active) setCatalogBusy(false); });
    return () => { active = false; };
  }, [category]);

  useEffect(() => {
    if (!brandId) { setModels([]); return; }
    let active = true;
    setCatalogBusy(true); setCatalogError(""); setModel(""); setStorage("");
    commerceApi.models(brandId, category).then(result => { if (active) setModels(Array.isArray(result.data) ? result.data : []); })
      .catch(err => { if (active) setCatalogError(err instanceof Error ? err.message : "Unable to load models."); })
      .finally(() => { if (active) setCatalogBusy(false); });
    return () => { active = false; };
  }, [brandId, category]);

  const selectedModel = useMemo(() => models.find(item => item.name === model), [models, model]);
  const storageOptions = selectedModel?.storage_options?.length ? selectedModel.storage_options : ["64GB", "128GB", "256GB", "512GB", "1 TB"];
  const progress = step / 8;

  const validateStep = () => {
    setError("");
    if (step === 1 && !category) return "Choose a device category.";
    if (step === 2 && !brand.trim()) return "Choose or enter the device brand.";
    if (step === 3 && !model.trim()) return "Choose or enter the device model.";
    if (step === 4 && !storage) return "Select the storage or variant.";
    if (step === 6 && photos.length === 0) return "Add at least one clear photo of your device.";
    if (step === 7 && (phone.trim().length !== 10 || !/^\d{6}$/.test(pincode) || address.trim().length < 8)) return "Enter a valid 10-digit phone number, complete pickup address and 6-digit PIN code.";
    return "";
  };

  const next = async () => {
    const validation = validateStep();
    if (validation) { setError(validation); return; }
    if (step === 7) {
      setBusy(true);
      try {
        const result = await commerceApi.tradeInQuote({
          category, brand, model, storage, screenCondition, bodyCondition,
          functionalChecks: { switchesOn, touchWorking, cameraClear, batteryHealthy },
          accessories: { hasBox, hasCharger, hasBill },
        });
        setQuote(result.data);
        setStep(8);
      } catch (err) { setError(err instanceof Error ? err.message : "Couldn't calculate your estimate. Try again."); }
      finally { setBusy(false); }
      return;
    }
    setStep(value => Math.min(8, value + 1));
  };

  const addPhotos = async () => {
    setError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { setError("Allow photo-library access to attach device photos."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsMultipleSelection: true, selectionLimit: 4, quality: 0.72, base64: true,
    });
    if (!result.canceled) setPhotos(current => [...current, ...result.assets].slice(0, 4));
  };

  const submit = async () => {
    setError("");
    if (!quote?.valuation) { setError("Please calculate the estimate again before submitting."); return; }
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (!photo.base64) throw new Error("A selected photo could not be read. Please remove it and choose again.");
        const mime = photo.mimeType || "image/jpeg";
        const upload = await commerceApi.uploadImageBase64(photo.base64, photo.fileName || `renewx-device-${Date.now()}-${i}.jpg`, mime);
        if (upload.data?.url) uploaded.push(upload.data.url);
      }
      const grade = screenCondition === "cracked" || bodyCondition === "dented" || !switchesOn ? "Needs repair" :
        screenCondition === "good" || bodyCondition === "fair" ? "Good" : "Like new";
      const result = await commerceApi.createTradeIn({
        category, brand: brand.trim(), model: model.trim(), storage,
        condition: {
          grade, screenCondition, bodyCondition, conditionNotes: conditionNotes.trim(),
          functionalChecks: { switchesOn, touchWorking, cameraClear, batteryHealthy },
          accessories: { hasBox, hasCharger, hasBill },
          photos: uploaded,
        },
        photos: uploaded, customerPhone: phone.trim(), address: address.trim(), pincode,
        expectedSellingPrice: Number(quote.valuation),
      });
      const id = String(result.data?.id || result.data?._id || "");
      setRequestId(id || "submitted");
      setStep(9);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit your sell request."); }
    finally { setBusy(false); }
  };

  const reset = () => {
    setStep(1); setCategory("Smartphone"); setQuote(null); setPhotos([]); setRequestId(""); setError("");
  };

  return <Screen contentContainerStyle={s.page}>
    <View style={s.header}>
      <Text style={s.eyebrow}>GIVE YOUR DEVICE A NEW LIFE</Text>
      <Text style={s.title}>Sell with RenewX</Text>
      <Text style={s.subtitle}>Complete these 8 quick steps to get an estimate and request a pickup.</Text>
    </View>
    {step <= 8 && <View style={s.progressCard}>
      <View style={s.progressTop}><Text style={s.progressLabel}>STEP {step} OF 8</Text><Text style={s.progressLabel}>{Math.round(progress * 100)}%</Text></View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${progress * 100}%` }]} /></View>
      <View style={s.stepLabels}><Text style={s.stepName}>{steps[step - 1]}</Text><Text style={s.stepHint}>Your details stay linked to your request</Text></View>
    </View>}

    {step === 1 && <View style={s.card}><Text style={s.sectionTitle}>What are you selling?</Text><Text style={s.help}>Choose the type of device you want to trade in.</Text><View style={s.choices}>{categories.map(item => <Choice key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}</View></View>}

    {step === 2 && <View style={s.card}><Text style={s.sectionTitle}>Choose the brand</Text><Text style={s.help}>Brands are loaded from the RenewX device catalogue.</Text>
      {catalogBusy && brands.length === 0 ? <ActivityIndicator color={colors.navy} /> : null}
      {brands.length > 0 && <View style={s.choices}>{brands.map(item => { const id = String(item._id || item.id || item.name); return <Choice key={id} label={item.name} selected={brandId === id} onPress={() => { setBrandId(id); setBrand(item.name); }} />; })}</View>}
      <Field label="Brand not listed? Enter it here" value={brandId ? "" : brand} onChangeText={value => { setBrand(value); setBrandId(""); }} placeholder="e.g. Apple" />
      {catalogError ? <Text style={s.inlineError}>{catalogError}</Text> : null}
    </View>}

    {step === 3 && <View style={s.card}><Text style={s.sectionTitle}>Select your model</Text><Text style={s.help}>{brand || "Your brand"} devices from the catalogue.</Text>
      {catalogBusy ? <ActivityIndicator color={colors.navy} /> : null}
      {models.length > 0 && <View style={s.choices}>{models.map(item => <Choice key={String(item._id || item.id || item.name)} label={item.name} selected={model === item.name} onPress={() => setModel(item.name)} />)}</View>}
      <Field label="Model not listed? Enter exact model" value={models.some(item => item.name === model) ? "" : model} onChangeText={setModel} placeholder="e.g. iPhone 15 Pro" />
      {catalogError ? <Text style={s.inlineError}>{catalogError}</Text> : null}
    </View>}

    {step === 4 && <View style={s.card}><Text style={s.sectionTitle}>Storage / variant</Text><Text style={s.help}>Select the exact storage capacity or variant of your device.</Text><View style={s.choices}>{storageOptions.map(item => <Choice key={item} label={item} selected={storage === item} onPress={() => setStorage(item)} />)}</View><Field label="Other variant (optional)" value={storageOptions.includes(storage) ? "" : storage} onChangeText={setStorage} placeholder="Enter variant" /></View>}

    {step === 5 && <View style={s.card}><Text style={s.sectionTitle}>Tell us about its condition</Text><Text style={s.help}>Answer honestly so the estimate is as accurate as possible.</Text>
      <Text style={s.label}>Screen condition</Text><View style={s.choices}>{screenOptions.map(item => <Choice key={item.value} label={item.label} selected={screenCondition === item.value} onPress={() => setScreenCondition(item.value)} />)}</View>
      <Text style={s.label}>Body condition</Text><View style={s.choices}>{bodyOptions.map(item => <Choice key={item.value} label={item.label} selected={bodyCondition === item.value} onPress={() => setBodyCondition(item.value)} />)}</View>
      <Text style={s.label}>Does each feature work?</Text>
      {[[ "Device switches on", switchesOn, setSwitchesOn ], ["Touchscreen works", touchWorking, setTouchWorking ], ["Camera is clear", cameraClear, setCameraClear ], ["Battery is healthy", batteryHealthy, setBatteryHealthy ]].map(([label, value, setter]: any) => <Pressable key={label} onPress={() => setter(!value)} style={s.toggleRow}><Ionicons name={value ? "checkbox" : "square-outline"} size={21} color={value ? colors.navy : colors.muted} /><Text style={s.toggleText}>{label}</Text></Pressable>)}
      <Text style={s.label}>Included accessories</Text>
      {[[ "Original box", hasBox, setHasBox ], ["Charger", hasCharger, setHasCharger ], ["Purchase bill", hasBill, setHasBill ]].map(([label, value, setter]: any) => <Pressable key={label} onPress={() => setter(!value)} style={s.toggleRow}><Ionicons name={value ? "checkbox" : "square-outline"} size={21} color={value ? colors.navy : colors.muted} /><Text style={s.toggleText}>{label}</Text></Pressable>)}
    </View>}

    {step === 6 && <View style={s.card}><Text style={s.sectionTitle}>Add device photos</Text><Text style={s.help}>Upload up to 4 clear photos. Include the front, back and any visible damage.</Text>
      <Pressable onPress={addPhotos} style={s.uploadBox}><Ionicons name="cloud-upload-outline" size={28} color={colors.navy} /><Text style={s.uploadTitle}>Choose photos</Text><Text style={s.help}>JPG, PNG or HEIC · Up to 4 images</Text></Pressable>
      <View style={s.photoGrid}>{photos.map((photo, index) => <View key={photo.assetId || photo.uri} style={s.photoWrap}><Image source={{ uri: photo.uri }} style={s.photo} /><Pressable onPress={() => setPhotos(current => current.filter((_, i) => i !== index))} style={s.removePhoto}><Ionicons name="close" size={15} color={colors.white} /></Pressable></View>)}</View>
      <Field label="Additional details (optional)" value={conditionNotes} onChangeText={setConditionNotes} placeholder="Mention repairs, scratches, faults or other details…" multiline />
    </View>}

    {step === 7 && <View style={s.card}><Text style={s.sectionTitle}>Where should we pick it up?</Text><Text style={s.help}>Our team will use these details to contact you and arrange pickup.</Text>
      <Field label="Contact number" value={phone} onChangeText={setPhone} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={10} />
      <Field label="Full pickup address" value={address} onChangeText={setAddress} placeholder="House / street, area, city, state" multiline />
      <Field label="PIN code" value={pincode} onChangeText={setPincode} placeholder="6-digit PIN code" keyboardType="number-pad" maxLength={6} />
    </View>}

    {step === 8 && <View style={s.card}><Text style={s.sectionTitle}>Your estimated value</Text><Text style={s.help}>Based on the device details and condition you provided.</Text>
      <View style={s.quoteBox}><Text style={s.quoteCaption}>ESTIMATED TRADE-IN VALUE</Text><Text style={s.quoteAmount}>₹{Number(quote?.valuation || 0).toLocaleString("en-IN")}</Text><Text style={s.quoteNote}>Valid for {quote?.validDays || 7} days · Final amount is subject to admin review and device inspection.</Text></View>
      <Text style={s.label}>Review your device</Text>
      {[["Device", `${brand} ${model}`], ["Category", category], ["Storage / variant", storage], ["Condition", `${screenCondition} screen · ${bodyCondition} body`], ["Photos", `${photos.length} attached`], ["Pickup", address], ["Contact", phone]].map(([label, value]) => <View key={label} style={s.reviewRow}><Text style={s.reviewLabel}>{label}</Text><Text style={s.reviewValue}>{value}</Text></View>)}
      <Text style={s.disclaimer}>Submitting sends your request to the RenewX team. Your request will show as Pending until an admin reviews it. The final approved value may change after inspection.</Text>
    </View>}

    {step === 9 && <View style={[s.card, s.doneCard]}><View style={s.doneIcon}><Ionicons name="checkmark" size={34} color={colors.white} /></View><Text style={s.sectionTitle}>Sell request submitted!</Text><Text style={s.help}>Your device details and photos have been sent to the RenewX team. Your request is now awaiting admin review.</Text><View style={s.requestId}><Text style={s.progressLabel}>REQUEST ID</Text><Text selectable style={s.requestIdText}>{requestId}</Text></View><Text style={s.quoteAmount}>₹{Number(quote?.valuation || 0).toLocaleString("en-IN")}</Text><Text style={s.help}>Estimated value · Pending admin approval</Text><Pressable onPress={reset} style={s.primaryButton}><Text style={s.primaryText}>Start another sell request</Text></Pressable></View>}

    {error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
    {step <= 8 && <View style={s.actions}>
      {step > 1 && <Pressable disabled={busy} onPress={() => { setError(""); setStep(value => value - 1); }} style={s.backButton}><Text style={s.backText}>Back</Text></Pressable>}
      <Pressable disabled={busy} onPress={step === 8 ? submit : next} style={[s.primaryButton, busy && s.disabled]}>{busy ? <ActivityIndicator color={colors.navy} /> : <><Text style={s.primaryText}>{step === 8 ? "Submit sell request" : step === 7 ? "Get my estimate" : "Continue"}</Text><Ionicons name="arrow-forward" size={18} color={colors.navy} /></>}</Pressable>
    </View>}
  </Screen>;
}

const s = StyleSheet.create({
  page: { paddingTop: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md, flexGrow: 1 },
  header: { gap: 6 }, eyebrow: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.navy, fontSize: 26, fontWeight: "900" }, subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  progressCard: { padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, gap: 9 },
  progressTop: { flexDirection: "row", justifyContent: "space-between" }, progressLabel: { color: colors.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  progressTrack: { height: 7, borderRadius: 8, backgroundColor: "#EEF0F3", overflow: "hidden" }, progressFill: { height: 7, borderRadius: 8, backgroundColor: colors.yellow },
  stepLabels: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }, stepName: { color: colors.navy, fontWeight: "900", fontSize: 13 }, stepHint: { color: colors.muted, fontSize: 11 },
  card: { padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, backgroundColor: colors.white, gap: 12 },
  sectionTitle: { color: colors.navy, fontSize: 19, fontWeight: "900" }, help: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, choice: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 13, paddingVertical: 10, backgroundColor: colors.white },
  choiceOn: { backgroundColor: colors.navy, borderColor: colors.navy }, choiceText: { color: colors.navy, fontSize: 12, fontWeight: "700" }, choiceTextOn: { color: colors.white },
  field: { gap: 7 }, label: { color: colors.navy, fontSize: 13, fontWeight: "800", marginTop: 5 },
  input: { minHeight: 47, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 13, color: colors.navy, fontSize: 14, backgroundColor: colors.white },
  multiline: { minHeight: 82, paddingTop: 12, textAlignVertical: "top" }, inlineError: { color: colors.danger, fontSize: 12 },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 5 }, toggleText: { color: colors.navy, fontSize: 13, fontWeight: "600" },
  uploadBox: { borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, borderRadius: radius.lg, padding: 22, alignItems: "center", gap: 7, backgroundColor: "#FAFAFA" },
  uploadTitle: { color: colors.navy, fontWeight: "900", fontSize: 14 }, photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoWrap: { position: "relative" }, photo: { width: 82, height: 82, borderRadius: radius.md, backgroundColor: "#EEF0F3" },
  removePhoto: { position: "absolute", top: -6, right: -6, width: 23, height: 23, borderRadius: 12, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 }, backButton: { minHeight: 50, paddingHorizontal: 22, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  backText: { color: colors.navy, fontWeight: "800" }, primaryButton: { flex: 1, minHeight: 50, backgroundColor: colors.yellow, borderRadius: radius.pill, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 16 },
  primaryText: { color: colors.navy, fontWeight: "900", fontSize: 13 }, disabled: { opacity: 0.6 }, error: { color: colors.danger, fontSize: 12, lineHeight: 18 },
  quoteBox: { backgroundColor: "#FFF8DB", borderRadius: radius.lg, padding: 18, gap: 6 }, quoteCaption: { color: colors.muted, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  quoteAmount: { color: colors.navy, fontSize: 30, fontWeight: "900" }, quoteNote: { color: colors.muted, fontSize: 11, lineHeight: 17 },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewLabel: { color: colors.muted, fontSize: 12, flex: 0.8 }, reviewValue: { color: colors.navy, fontSize: 12, fontWeight: "700", flex: 1.2, textAlign: "right" },
  disclaimer: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 5 }, doneCard: { alignItems: "center", paddingVertical: 28, flex: 1, justifyContent: "center" },
  doneIcon: { width: 66, height: 66, borderRadius: 33, backgroundColor: colors.success, alignItems: "center", justifyContent: "center" },
  requestId: { width: "100%", backgroundColor: "#F5F6F8", borderRadius: radius.md, padding: 14, gap: 5, alignItems: "center" },
  requestIdText: { color: colors.navy, fontSize: 13, fontWeight: "900" },
});
