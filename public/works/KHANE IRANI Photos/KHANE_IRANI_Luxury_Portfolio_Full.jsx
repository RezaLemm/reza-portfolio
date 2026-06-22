#target "InDesign"

/*
KHANE IRANI — Luxury Portfolio Builder
Version: Full Safe Edition for InDesign 2026
Designer: Reza Mousazadeh Moghdam
Language: Persian + English
Features:
- 22 pages
- Safe font fallback
- Optional image folder selection
- Automatic image placement if available
- Placeholder if not found
- Elegant CMYK palette
- Paragraph/Object styles
- Persian/English editorial structure
*/

(function () {

    // =========================================================
    // BASIC SAFETY
    // =========================================================
    if (app.documents.length >= 0) {
        // Continue safely
    }

    // =========================================================
    // SAFE FONT RESOLVER
    // =========================================================
    function getSafeFont(candidates) {
        for (var i = 0; i < candidates.length; i++) {
            try {
                var f = app.fonts.itemByName(candidates[i]);
                if (f && f.isValid) return candidates[i];
            } catch (e) {}
        }
        try {
            if (app.fonts.length > 0) return app.fonts[0].name;
        } catch (e2) {}
        return "Arial\tRegular";
    }

    var FONT_FA_REG = getSafeFont([
        "Vazirmatn\tRegular",
        "Vazirmatn Regular",
        "IRANSans\tRegular",
        "IRANSans Regular",
        "Tahoma\tRegular",
        "Arial\tRegular"
    ]);

    var FONT_FA_BOLD = getSafeFont([
        "Vazirmatn\tBold",
        "Vazirmatn Bold",
        "IRANSans\tBold",
        "IRANSans Bold",
        "Tahoma\tBold",
        "Arial\tBold"
    ]);

    var FONT_EN_REG = getSafeFont([
        "Georgia\tRegular",
        "Georgia",
        "Times New Roman\tRegular",
        "Times New Roman",
        "Arial\tRegular"
    ]);

    var FONT_EN_BOLD = getSafeFont([
        "Georgia\tBold",
        "Georgia Bold",
        "Times New Roman\tBold",
        "Times New Roman Bold",
        "Arial\tBold"
    ]);

    var FONT_EN_ITALIC = getSafeFont([
        "Georgia\tItalic",
        "Georgia Italic",
        "Times New Roman\tItalic",
        "Times New Roman Italic",
        "Arial\tRegular"
    ]);

    // =========================================================
    // IMAGE FOLDER
    // =========================================================
    var imageFolder = null;
    try {
        imageFolder = Folder.selectDialog("Select the image folder for KHANE IRANI portfolio");
    } catch (e) {
        imageFolder = null;
    }

    var imageFiles = [];
    if (imageFolder) {
        try {
            imageFiles = imageFolder.getFiles(function (f) {
                if (!(f instanceof File)) return false;
                var n = f.name.toLowerCase();
                return (
                    n.match(/\.(jpg|jpeg|png|tif|tiff|psd|ai|pdf|eps|webp)$/) !== null
                );
            });
        } catch (e2) {
            imageFiles = [];
        }
    }

    var imageIndex = 0;

    function nextImageFile() {
        if (!imageFiles || imageFiles.length === 0) return null;
        if (imageIndex >= imageFiles.length) imageIndex = 0;
        var file = imageFiles[imageIndex];
        imageIndex++;
        return file;
    }

    // =========================================================
    // CREATE DOCUMENT
    // =========================================================
    var doc = app.documents.add();

    doc.documentPreferences.properties = {
        pageWidth: "297mm",
        pageHeight: "210mm",
        facingPages: false,
        pagesPerDocument: 22
    };

    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.zeroPoint = [0, 0];

    for (var i = 0; i < doc.pages.length; i++) {
        doc.pages[i].marginPreferences.properties = {
            top: 14,
            bottom: 14,
            left: 16,
            right: 16,
            columnCount: 1,
            columnGutter: 6
        };
    }

    // =========================================================
    // COLOR CREATION
    // =========================================================
    function getOrCreateColor(name, c, m, y, k) {
        try {
            var existing = doc.colors.itemByName(name);
            existing.name;
            return existing;
        } catch (e) {}

        var col = doc.colors.add();
        col.properties = {
            name: name,
            model: ColorModel.PROCESS,
            space: ColorSpace.CMYK,
            colorValue: [c, m, y, k]
        };
        return col;
    }

    var CREAM      = getOrCreateColor("KI_Cream", 4, 6, 14, 0);
    var CHARCOAL   = getOrCreateColor("KI_Charcoal", 65, 55, 50, 70);
    var TERRACOTTA = getOrCreateColor("KI_Terracotta", 17, 70, 73, 7);
    var GOLD       = getOrCreateColor("KI_Gold", 16, 25, 54, 8);
    var OLIVE      = getOrCreateColor("KI_Olive", 38, 28, 65, 18);
    var SOFTBLACK  = getOrCreateColor("KI_SoftBlack", 55, 45, 45, 85);
    var DUST       = getOrCreateColor("KI_Dust", 8, 12, 20, 3);
    var LINEGRAY   = getOrCreateColor("KI_LineGray", 12, 10, 14, 18);
    var WHITE      = doc.swatches.itemByName("Paper");
    var NONE       = doc.swatches.itemByName("None");

    // =========================================================
    // LAYERS
    // =========================================================
    var layerBg = doc.layers.add({ name: "Background" });
    var layerImage = doc.layers.add({ name: "Images" });
    var layerText = doc.layers.add({ name: "Text" });
    var layerDeco = doc.layers.add({ name: "Decor" });

    // =========================================================
    // STYLE HELPERS
    // =========================================================
    function ensureParagraphStyle(name, props) {
        var ps;
        try {
            ps = doc.paragraphStyles.itemByName(name);
            ps.name;
        } catch (e) {
            ps = doc.paragraphStyles.add({ name: name });
        }
        for (var k in props) {
            try { ps[k] = props[k]; } catch (e2) {}
        }
        return ps;
    }

    function ensureObjectStyle(name, props) {
        var os;
        try {
            os = doc.objectStyles.itemByName(name);
            os.name;
        } catch (e) {
            os = doc.objectStyles.add({ name: name });
        }
        for (var k in props) {
            try { os[k] = props[k]; } catch (e2) {}
        }
        return os;
    }

    // =========================================================
    // PARAGRAPH STYLES
    // =========================================================
    var psTitleEn = ensureParagraphStyle("KI_Title_EN", {
        appliedFont: FONT_EN_BOLD,
        pointSize: 26,
        leading: 30,
        fillColor: CHARCOAL,
        tracking: 0,
        justification: Justification.LEFT_ALIGN
    });

    var psTitleEnLarge = ensureParagraphStyle("KI_Title_EN_Large", {
        appliedFont: FONT_EN_BOLD,
        pointSize: 34,
        leading: 38,
        fillColor: CHARCOAL,
        tracking: 5,
        justification: Justification.LEFT_ALIGN
    });

    var psSubEn = ensureParagraphStyle("KI_Sub_EN", {
        appliedFont: FONT_EN_REG,
        pointSize: 12,
        leading: 16,
        fillColor: GOLD,
        tracking: 140,
        capitalization: Capitalization.ALL_CAPS,
        justification: Justification.LEFT_ALIGN
    });

    var psBodyEn = ensureParagraphStyle("KI_Body_EN", {
        appliedFont: FONT_EN_REG,
        pointSize: 10.5,
        leading: 17,
        fillColor: SOFTBLACK,
        justification: Justification.LEFT_ALIGN
    });

    var psBodyEnItalic = ensureParagraphStyle("KI_Body_EN_Italic", {
        appliedFont: FONT_EN_ITALIC,
        pointSize: 10.5,
        leading: 17,
        fillColor: SOFTBLACK,
        justification: Justification.LEFT_ALIGN
    });

    var psSmallEn = ensureParagraphStyle("KI_Small_EN", {
        appliedFont: FONT_EN_REG,
        pointSize: 8.5,
        leading: 11,
        fillColor: GOLD,
        tracking: 120,
        capitalization: Capitalization.ALL_CAPS,
        justification: Justification.LEFT_ALIGN
    });

    var psTitleFa = ensureParagraphStyle("KI_Title_FA", {
        appliedFont: FONT_FA_BOLD,
        pointSize: 27,
        leading: 35,
        fillColor: CHARCOAL,
        justification: Justification.RIGHT_ALIGN
    });

    var psSubFa = ensureParagraphStyle("KI_Sub_FA", {
        appliedFont: FONT_FA_REG,
        pointSize: 13.5,
        leading: 20,
        fillColor: TERRACOTTA,
        justification: Justification.RIGHT_ALIGN
    });

    var psBodyFa = ensureParagraphStyle("KI_Body_FA", {
        appliedFont: FONT_FA_REG,
        pointSize: 11.5,
        leading: 20,
        fillColor: SOFTBLACK,
        justification: Justification.RIGHT_ALIGN
    });

    var psCaptionFa = ensureParagraphStyle("KI_Caption_FA", {
        appliedFont: FONT_FA_REG,
        pointSize: 9.5,
        leading: 14,
        fillColor: GOLD,
        justification: Justification.RIGHT_ALIGN
    });

    var psPageNum = ensureParagraphStyle("KI_PageNo", {
        appliedFont: FONT_EN_REG,
        pointSize: 9,
        leading: 11,
        fillColor: GOLD,
        tracking: 160,
        justification: Justification.RIGHT_ALIGN
    });

    // =========================================================
    // OBJECT STYLES
    // =========================================================
    var osImageFrame = ensureObjectStyle("KI_ImageFrame", {
        enableStroke: true,
        strokeWeight: 0.7,
        strokeColor: GOLD,
        fillColor: WHITE
    });

    var osBorderBox = ensureObjectStyle("KI_BorderBox", {
        enableStroke: true,
        strokeWeight: 0.8,
        strokeColor: GOLD,
        fillColor: NONE
    });

    var osPlainBox = ensureObjectStyle("KI_PlainBox", {
        enableStroke: false,
        fillColor: CREAM
    });

    // =========================================================
    // GENERIC HELPERS
    // =========================================================
    function applyRTL(tf) {
        try {
            tf.storyPreferences.storyDirection = StoryDirectionOptions.RIGHT_TO_LEFT_DIRECTION;
        } catch (e) {}
    }

    function applyLTR(tf) {
        try {
            tf.storyPreferences.storyDirection = StoryDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
        } catch (e) {}
    }

    function addTextFrame(page, bounds, text, style, color, layer, rtl) {
        var tf = page.textFrames.add(layer ? layer : layerText);
        tf.geometricBounds = bounds;
        tf.contents = text;

        try { tf.parentStory.appliedParagraphStyle = style; } catch (e) {}
        try { tf.parentStory.fillColor = color || style.fillColor; } catch (e2) {}
        try { tf.textFramePreferences.verticalJustification = VerticalJustification.TOP_ALIGN; } catch (e3) {}

        if (rtl) applyRTL(tf); else applyLTR(tf);

        return tf;
    }

    function addBox(page, bounds, fillColor, strokeColor, strokeWeight, layer) {
        var r = page.rectangles.add(layer ? layer : layerDeco);
        r.geometricBounds = bounds;
        try { r.fillColor = fillColor || NONE; } catch (e) {}
        try { r.strokeColor = strokeColor || NONE; } catch (e2) {}
        try { r.strokeWeight = strokeWeight || 0; } catch (e3) {}
        return r;
    }

    function addLine(page, x1, y1, x2, y2, strokeColor, strokeWeight, layer) {
        var line = page.graphicLines.add(layer ? layer : layerDeco);
        line.paths.item(0).entirePath = [[x1, y1], [x2, y2]];
        try { line.strokeColor = strokeColor || GOLD; } catch (e) {}
        try { line.strokeWeight = strokeWeight || 0.6; } catch (e2) {}
        return line;
    }

    function addPageNumber(page, num) {
        addTextFrame(
            page,
            [193, 254, 203, 280],
            ("0" + num).slice(-2),
            psPageNum,
            GOLD,
            layerText,
            false
        );
    }

    function fitImage(frame) {
        try { frame.fit(FitOptions.CONTENT_PROPORTIONALLY); } catch (e) {}
        try { frame.fit(FitOptions.CENTER_CONTENT); } catch (e2) {}
    }

    function placeImageOrPlaceholder(page, bounds, label) {
        var file = nextImageFile();
        var rect = page.rectangles.add(layerImage);
        rect.geometricBounds = bounds;
        rect.appliedObjectStyle = osImageFrame;

        if (file) {
            try {
                rect.place(file);
                fitImage(rect);
                return rect;
            } catch (e) {}
        }

        var ph = page.rectangles.add(layerImage);
        ph.geometricBounds = bounds;
        ph.appliedObjectStyle = osImageFrame;
        try { ph.fillColor = DUST; } catch (e2) {}

        var tf = page.textFrames.add(layerText);
        tf.geometricBounds = bounds;
        tf.contents = label || "IMAGE";
        try {
            tf.parentStory.appliedParagraphStyle = psBodyEn;
            tf.parentStory.justification = Justification.CENTER_ALIGN;
            tf.parentStory.fillColor = GOLD;
            tf.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
        } catch (e3) {}
        return ph;
    }

    function addBackground(page, colorName) {
        var bg = page.rectangles.add(layerBg);
        bg.geometricBounds = [0, 0, 210, 297];
        bg.fillColor = colorName || CREAM;
        bg.strokeWeight = 0;
        try { bg.sendToBack(); } catch (e) {}
    }

    function addOuterBorder(page) {
        var border = page.rectangles.add(layerDeco);
        border.geometricBounds = [12, 12, 198, 285];
        border.appliedObjectStyle = osBorderBox;
        return border;
    }

    function addTopLabel(page, label, x, y) {
        addTextFrame(page, [y, x, y + 10, x + 80], label, psSmallEn, GOLD, layerText, false);
    }

    function addSectionHeader(page, num, title, subtitle) {
        addTextFrame(page, [22, 20, 36, 60], num, psSubEn, GOLD, layerText, false);
        addTextFrame(page, [38, 20, 58, 150], title, psTitleEn, CHARCOAL, layerText, false);
        addTextFrame(page, [60, 20, 72, 150], subtitle, psSubEn, GOLD, layerText, false);
        addLine(page, 20, 77, 118, 77, TERRACOTTA, 1.0, layerDeco);
    }

    function addDualTextBlock(page, enText, faText) {
        addTextFrame(page, [86, 20, 155, 125], enText, psBodyEn, SOFTBLACK, layerText, false);
        addTextFrame(page, [86, 160, 160, 277], faText, psBodyFa, SOFTBLACK, layerText, true);
    }

    // =========================================================
    // PAGE BACKGROUNDS
    // =========================================================
    for (i = 0; i < doc.pages.length; i++) {
        addBackground(doc.pages[i], CREAM);
    }

    // =========================================================
    // PAGE 1 — COVER
    // =========================================================
    var p1 = doc.pages[0];
    addOuterBorder(p1);
    addBox(p1, [18, 18, 192, 279], NONE, GOLD, 0.6, layerDeco);
    addTextFrame(p1, [40, 145, 72, 272], "KHANE IRANI", psTitleEnLarge, CHARCOAL, layerText, false);
    addTextFrame(p1, [76, 148, 90, 272], "BRAND IDENTITY PORTFOLIO", psSubEn, GOLD, layerText, false);
    addLine(p1, 180, 100, 270, 100, TERRACOTTA, 1.2, layerDeco);
    addTextFrame(p1, [108, 130, 142, 272], "خانه ایرانی", psTitleFa, CHARCOAL, layerText, true);
    addTextFrame(p1, [145, 132, 176, 272], "هویت بصری، منو، کارت ویزیت و ارائه لوکس برند", psSubFa, TERRACOTTA, layerText, true);
    addTextFrame(p1, [176, 150, 193, 272], "Designed by Reza Mousazadeh Moghdam", psBodyEn, SOFTBLACK, layerText, false);
    addPageNumber(p1, 1);

    // =========================================================
    // PAGE 2 — OVERVIEW
    // =========================================================
    var p2 = doc.pages[1];
    addSectionHeader(p2, "01", "Project Overview", "Identity / Mood / Cultural Presence");
    addDualTextBlock(
        p2,
        "Khane Irani is a visual identity project inspired by warmth, cultural memory, spatial familiarity, and refined elegance. The intention is to create a brand that feels both premium and emotionally rooted.",
        "خانه ایرانی پروژه‌ای در حوزه هویت بصری است که از گرما، خاطره جمعی، حس آشنای فضاهای ایرانی و زیبایی پالایش‌شده الهام گرفته است. هدف این هویت، خلق برندی است که هم ممتاز و هم عمیقاً انسانی و آشنا باشد."
    );
    addTextFrame(p2, [165, 20, 192, 125], "Creative Direction / Brand Identity / Editorial Presentation", psBodyEnItalic, SOFTBLACK, layerText, false);
    addPageNumber(p2, 2);

    // =========================================================
    // PAGE 3 — DESIGNER
    // =========================================================
    var p3 = doc.pages[2];
    addSectionHeader(p3, "02", "Designer", "Author / Visual Direction");
    addTextFrame(p3, [88, 20, 125, 130], "Reza Mousazadeh Moghdam", psTitleEn, CHARCOAL, layerText, false);
    addTextFrame(p3, [128, 20, 145, 130], "Visual Identity Designer", psSubEn, GOLD, layerText, false);
    addTextFrame(p3, [90, 160, 125, 277], "رضا موسی زاده مقدم", psTitleFa, CHARCOAL, layerText, true);
    addTextFrame(p3, [128, 160, 150, 277], "طراح هویت بصری", psSubFa, TERRACOTTA, layerText, true);
    addTextFrame(
        p3,
        [154, 20, 194, 277],
        "This portfolio presents the strategic and visual development of the KHANE IRANI brand across identity assets, print collateral, menu design, business cards, and applied visual language.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addPageNumber(p3, 3);

    // =========================================================
    // PAGE 4 — CONCEPT
    // =========================================================
    var p4 = doc.pages[3];
    addSectionHeader(p4, "03", "Concept Narrative", "Meaning / Atmosphere / Brand Soul");
    addDualTextBlock(
        p4,
        "The brand seeks to capture the emotional architecture of Iranian life: hospitality, memory, tactile warmth, and a quiet sense of dignity. It is not only a visual system, but an atmosphere translated into form.",
        "این برند تلاش می‌کند معماری احساسی زندگی ایرانی را بازتاب دهد: مهمان‌نوازی، خاطره، گرمای ملموس و نوعی وقار آرام. این پروژه فقط یک سیستم بصری نیست، بلکه نوعی فضا و احساس است که به فرم ترجمه شده است."
    );
    addPageNumber(p4, 4);

    // =========================================================
    // PAGE 5 — LOGO CONCEPT
    // =========================================================
    var p5 = doc.pages[4];
    addSectionHeader(p5, "04", "Logo Concept", "Symbol / Geometry / Memory");
    placeImageOrPlaceholder(p5, [24, 182, 112, 277], "LOGO / SYMBOL");
    addTextFrame(
        p5,
        [84, 20, 148, 140],
        "The symbol draws from the emotional geometry of Iranian interiors and domestic architecture. It expresses enclosure, balance, grounding, and the intimate order of familiar spaces.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addTextFrame(
        p5,
        [152, 20, 196, 277],
        "نماد طراحی‌شده از هندسه احساسی فضاهای داخلی و معماری خانگی ایرانی الهام گرفته است؛ فرمی که حس دربرگیری، تعادل، استقرار و نظم صمیمی فضاهای آشنا را بازتاب می‌دهد.",
        psBodyFa,
        SOFTBLACK,
        layerText,
        true
    );
    addPageNumber(p5, 5);

    // =========================================================
    // PAGE 6 — SYMBOL EXPLANATION
    // =========================================================
    var p6 = doc.pages[5];
    addSectionHeader(p6, "05", "Symbol Explanation", "Form / Identity / Emotion");
    addTextFrame(
        p6,
        [84, 20, 146, 130],
        "The logo is designed to feel grounded and culturally resonant rather than decorative. Its visual language connects memory, structure, and modern restraint.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addTextFrame(
        p6,
        [84, 160, 150, 277],
        "لوگو به‌گونه‌ای طراحی شده است که به‌جای تزئینی بودن، ریشه‌دار و دارای طنین فرهنگی باشد. زبان بصری آن میان خاطره، ساختار و خویشتن‌داری معاصر تعادل ایجاد می‌کند.",
        psBodyFa,
        SOFTBLACK,
        layerText,
        true
    );
    placeImageOrPlaceholder(p6, [28, 145, 116, 277], "SYMBOL APPLICATION");
    addPageNumber(p6, 6);

    // =========================================================
    // PAGE 7 — COLOR PALETTE
    // =========================================================
    var p7 = doc.pages[6];
    addSectionHeader(p7, "06", "Color Palette", "Warmth / Earth / Elegance");

    addBox(p7, [82, 20, 120, 58], TERRACOTTA, NONE, 0, layerDeco);
    addBox(p7, [82, 66, 120, 104], GOLD, NONE, 0, layerDeco);
    addBox(p7, [82, 112, 120, 150], OLIVE, NONE, 0, layerDeco);
    addBox(p7, [82, 158, 120, 196], CHARCOAL, NONE, 0, layerDeco);
    addBox(p7, [82, 204, 120, 242], CREAM, GOLD, 0.5, layerDeco);

    addTextFrame(p7, [126, 20, 160, 242], "Terracotta / Gold / Olive / Charcoal / Cream", psBodyEn, SOFTBLACK, layerText, false);
    addTextFrame(
        p7,
        [168, 20, 198, 277],
        "پالت رنگی پروژه از خاک، متریال طبیعی، گرما و وقار الهام گرفته است. این رنگ‌ها هم‌زمان حس لوکس، انسانی و فرهنگی برند را تقویت می‌کنند.",
        psBodyFa,
        SOFTBLACK,
        layerText,
        true
    );
    addPageNumber(p7, 7);

    // =========================================================
    // PAGE 8 — COLOR MEANING
    // =========================================================
    var p8 = doc.pages[7];
    addSectionHeader(p8, "07", "Color Meaning", "Psychology / Material / Tone");
    addDualTextBlock(
        p8,
        "Terracotta introduces warmth and earthiness. Gold suggests refinement and quiet luxury. Olive adds organic depth, while charcoal provides visual gravity and confidence. Cream softens the system with calm and openness.",
        "رنگ تراکوتا حس گرما و خاک‌بودگی را وارد هویت می‌کند. طلایی نشانه ظرافت و لوکس‌بودن آرام است. زیتونی عمق طبیعی ایجاد می‌کند و زغالی به هویت وزن و اطمینان می‌دهد. کرم نیز با لطافت خود، فضا را آرام و باز نگه می‌دارد."
    );
    addPageNumber(p8, 8);

    // =========================================================
    // PAGE 9 — PRIMARY LOGO
    // =========================================================
    var p9 = doc.pages[8];
    addSectionHeader(p9, "08", "Primary Logo", "Master Mark / Brand Signature");
    placeImageOrPlaceholder(p9, [28, 150, 120, 277], "PRIMARY LOGO");
    placeImageOrPlaceholder(p9, [86, 20, 188, 132], "DETAIL / CLOSE-UP");
    addTextFrame(
        p9,
        [130, 150, 188, 277],
        "Primary signature showcasing the core balance between elegance, legibility, and cultural character.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addPageNumber(p9, 9);

    // =========================================================
    // PAGE 10 — LOGO VARIATIONS
    // =========================================================
    var p10 = doc.pages[9];
    addSectionHeader(p10, "09", "Logo Variations", "Responsive Versions / Usage");
    placeImageOrPlaceholder(p10, [28, 20, 88, 95], "VERTICAL");
    placeImageOrPlaceholder(p10, [28, 110, 88, 185], "HORIZONTAL");
    placeImageOrPlaceholder(p10, [28, 200, 88, 275], "ICON");
    placeImageOrPlaceholder(p10, [102, 20, 162, 95], "MONO");
    placeImageOrPlaceholder(p10, [102, 110, 162, 185], "INVERSE");
    placeImageOrPlaceholder(p10, [102, 200, 162, 275], "STAMP");
    addPageNumber(p10, 10);

    // =========================================================
    // PAGE 11 — TYPOGRAPHY
    // =========================================================
    var p11 = doc.pages[10];
    addSectionHeader(p11, "10", "Typography System", "Hierarchy / Contrast / Editorial Tone");
    addTextFrame(p11, [84, 20, 110, 150], "Aa Bb Cc 123", psTitleEnLarge, CHARCOAL, layerText, false);
    addTextFrame(p11, [116, 20, 140, 150], "Editorial elegance with clarity and restraint.", psBodyEn, SOFTBLACK, layerText, false);
    addTextFrame(p11, [84, 160, 110, 277], "خانه ایرانی", psTitleFa, CHARCOAL, layerText, true);
    addTextFrame(p11, [116, 160, 150, 277], "تایپوگرافی این پروژه مبتنی بر خوانایی، وقار و هماهنگی با لحن بصری برند است.", psBodyFa, SOFTBLACK, layerText, true);
    addPageNumber(p11, 11);

    // =========================================================
    // PAGE 12 — BUSINESS CARD
    // =========================================================
    var p12 = doc.pages[11];
    addSectionHeader(p12, "11", "Business Card", "Print Identity / Contact Asset");
    placeImageOrPlaceholder(p12, [32, 20, 120, 132], "VISIT CARD FRONT");
    placeImageOrPlaceholder(p12, [78, 145, 166, 277], "VISIT CARD BACK");
    addTextFrame(
        p12,
        [170, 145, 193, 277],
        "Business card system designed to extend the brand's warmth and minimal luxury.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addPageNumber(p12, 12);

    // =========================================================
    // PAGE 13 — BUSINESS CARD MOCKUP
    // =========================================================
    var p13 = doc.pages[12];
    addSectionHeader(p13, "12", "Business Card Mockup", "Material / Texture / Presence");
    placeImageOrPlaceholder(p13, [28, 20, 188, 277], "MOCKUP");
    addPageNumber(p13, 13);

    // =========================================================
    // PAGE 14 — MENU COVER
    // =========================================================
    var p14 = doc.pages[13];
    addSectionHeader(p14, "13", "Menu Cover", "Hospitality / Front Presentation");
    placeImageOrPlaceholder(p14, [28, 155, 188, 277], "MENU COVER");
    addTextFrame(
        p14,
        [90, 20, 168, 138],
        "The menu cover is treated as an extension of the brand identity: tactile, elegant, balanced, and emotionally warm.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addPageNumber(p14, 14);

    // =========================================================
    // PAGE 15 — MENU LAYOUT 1
    // =========================================================
    var p15 = doc.pages[14];
    addSectionHeader(p15, "14", "Menu Layout 01", "Structure / White Space / Hierarchy");
    placeImageOrPlaceholder(p15, [28, 20, 188, 135], "MENU 01");
    placeImageOrPlaceholder(p15, [28, 150, 188, 277], "DETAIL");
    addPageNumber(p15, 15);

    // =========================================================
    // PAGE 16 — MENU LAYOUT 2
    // =========================================================
    var p16 = doc.pages[15];
    addSectionHeader(p16, "15", "Menu Layout 02", "Editorial Flow / Readability");
    placeImageOrPlaceholder(p16, [28, 20, 188, 135], "MENU 02");
    placeImageOrPlaceholder(p16, [28, 150, 188, 277], "CLOSE VIEW");
    addPageNumber(p16, 16);

    // =========================================================
    // PAGE 17 — MENU LAYOUT 3
    // =========================================================
    var p17 = doc.pages[16];
    addSectionHeader(p17, "16", "Menu Layout 03", "Refinement / Composition / Rhythm");
    placeImageOrPlaceholder(p17, [28, 20, 188, 135], "MENU 03");
    placeImageOrPlaceholder(p17, [28, 150, 188, 277], "INSIDE PAGE");
    addPageNumber(p17, 17);

    // =========================================================
    // PAGE 18 — BRAND APPLICATIONS
    // =========================================================
    var p18 = doc.pages[17];
    addSectionHeader(p18, "17", "Brand Applications", "Collateral / Extensions / Consistency");
    placeImageOrPlaceholder(p18, [28, 20, 105, 132], "APPLICATION 01");
    placeImageOrPlaceholder(p18, [28, 145, 105, 277], "APPLICATION 02");
    placeImageOrPlaceholder(p18, [112, 20, 188, 132], "APPLICATION 03");
    placeImageOrPlaceholder(p18, [112, 145, 188, 277], "APPLICATION 04");
    addPageNumber(p18, 18);

    // =========================================================
    // PAGE 19 — PRINT / PACKAGING
    // =========================================================
    var p19 = doc.pages[18];
    addSectionHeader(p19, "18", "Print / Packaging", "Material System / Brand Touchpoints");
    placeImageOrPlaceholder(p19, [28, 20, 188, 180], "PACKAGING / PRINT");
    addTextFrame(
        p19,
        [30, 190, 180, 277],
        "Additional print and packaging applications reinforce material warmth, tactile richness, and premium simplicity across the brand ecosystem.",
        psBodyEn,
        SOFTBLACK,
        layerText,
        false
    );
    addPageNumber(p19, 19);

    // =========================================================
    // PAGE 20 — MOCKUP SHOWCASE
    // =========================================================
    var p20 = doc.pages[19];
    addSectionHeader(p20, "19", "Mockup Showcase", "Presentation / Atmosphere / Realism");
    placeImageOrPlaceholder(p20, [28, 20, 188, 277], "FULL MOCKUP");
    addPageNumber(p20, 20);

    // =========================================================
    // PAGE 21 — FINAL STATEMENT
    // =========================================================
    var p21 = doc.pages[20];
    addSectionHeader(p21, "20", "Final Statement", "Identity / Continuity / Character");
    addDualTextBlock(
        p21,
        "KHANE IRANI is designed as a brand identity that bridges elegance with familiarity. Through restrained form, warm color, and meaningful composition, it aims to feel premium, memorable, and emotionally grounded.",
        "خانه ایرانی به‌عنوان هویتی طراحی شده است که میان وقار و آشنایی پیوند برقرار می‌کند. این پروژه با استفاده از فرم کنترل‌شده، رنگ‌های گرم و ترکیب‌بندی معنادار، تلاش می‌کند هم ممتاز، هم ماندگار و هم احساسی باشد."
    );
    addPageNumber(p21, 21);

    // =========================================================
    // PAGE 22 — CLOSING
    // =========================================================
    var p22 = doc.pages[21];
    addOuterBorder(p22);
    addTextFrame(p22, [70, 70, 102, 227], "KHANE IRANI", psTitleEnLarge, CHARCOAL, layerText, false);
    addTextFrame(p22, [106, 82, 120, 227], "BRAND IDENTITY PORTFOLIO", psSubEn, GOLD, layerText, false);
    addLine(p22, 96, 128, 200, 128, TERRACOTTA, 1.1, layerDeco);
    addTextFrame(p22, [136, 80, 164, 227], "Designed by Reza Mousazadeh Moghdam", psBodyEn, SOFTBLACK, layerText, false);
    addTextFrame(p22, [164, 80, 186, 227], "رضا موسی زاده مقدم", psSubFa, TERRACOTTA, layerText, true);
    addPageNumber(p22, 22);

    // =========================================================
    // OPTIONAL PAGE TRANSITION DECOR
    // =========================================================
    for (i = 0; i < doc.pages.length; i++) {
        var pg = doc.pages[i];
        addLine(pg, 16, 187, 281, 187, LINEGRAY, 0.3, layerDeco);
    }

    // =========================================================
    // FINAL ALERT
    // =========================================================
    alert(
        "KHANE IRANI luxury portfolio created successfully.\n\n" +
        "Fonts used:\n" +
        "FA Regular: " + FONT_FA_REG + "\n" +
        "FA Bold: " + FONT_FA_BOLD + "\n" +
        "EN Regular: " + FONT_EN_REG + "\n" +
        "EN Bold: " + FONT_EN_BOLD + "\n\n" +
        "Images found: " + imageFiles.length
    );

})();
