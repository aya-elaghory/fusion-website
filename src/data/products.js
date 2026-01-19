import { Percent } from "lucide-react";

// Step 1: Define the raw product data, raw concerns, and raw ingredients
const rawProducts = [
    {
        id: 1,
        name: "Topical Cream HQ8",
        description: "A prescription dark spot corrector cream with hydroquinone and powerful ingredients to treat melasma, fade dark spots, reduce acne, and calm irritation while brightening the complexion.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Hydrocortisone", percentage: "2%" },
            { name: "Hydroquinone", percentage: "8%" },
            { name: "Tretinoin", percentage: "0.025%" },
            { name: "Kojic Acid", percentage: "" },
            { name: "Vitamin E", percentage: "" }
        ],
        concerns: [
            "Hyperpigmentation",
            "Melasma",
            "Acne",
            "Wrinkles (Face)",
            "Redness",
            "Uneven Skin Tone"
        ],
        howWhy: "This cream targets hyperpigmentation through a multi-pronged approach: hydroquinone and kojic acid directly inhibit melanin production by targeting tyrosinase, the enzyme responsible for melanin synthesis, effectively lightening dark spots and melasma. Tretinoin accelerates cell turnover, which not only helps fade pigmentation by shedding pigmented skin cells but also unclogs pores to address mild acne and improves overall skin texture. Hydrocortisone reduces inflammation, which is crucial because hyperpigmentation often occurs with irritation (e.g., post-inflammatory hyperpigmentation from acne), and tretinoin can cause initial redness or peeling. Vitamin E acts as an antioxidant, protecting the skin from oxidative stress that can worsen pigmentation, while also providing hydration to counteract the drying effects of tretinoin. Together, these ingredients work synergistically to lighten pigmentation, reduce inflammation, and promote skin renewal.",
        howToUse: "Cleanse the face with a gentle cleanser and pat dry. Apply a pea-sized amount to the affected areas (e.g., dark spots or melasma patches) once daily at night, as tretinoin and hydroquinone increase photosensitivity. Spread evenly in a thin layer, avoiding the eyes, mouth, nostrils, and any open wounds. If new to tretinoin, start with 2-3 applications per week for the first 2 weeks to minimize irritation (e.g., redness, peeling), then gradually increase to nightly use as tolerated. Follow with a moisturizer if dryness occurs, but wait 10-15 minutes to allow absorption. In the morning, cleanse the skin and apply a broad-spectrum sunscreen (SPF 30 or higher) to protect against UV-induced pigmentation and irritation. Use for 8-12 weeks, then consult a healthcare provider, as prolonged hydroquinone use may lead to ochronosis (a rare bluish-black discoloration).",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 2,
        name: "Topical Cream HQ4",
        description: "A gentler prescription dark spot corrector cream with a lower hydroquinone concentration to treat melasma, fade dark spots, reduce acne, and calm irritation, ideal for sensitive skin.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Hydrocortisone", percentage: "2%" },
            { name: "Hydroquinone", percentage: "4%" },
            { name: "Tretinoin", percentage: "0.025%" },
            { name: "Kojic Acid", percentage: "" },
            { name: "Vitamin E", percentage: "" }
        ],
        concerns: [
            "Hyperpigmentation",
            "Melasma",
            "Acne",
            "Irritation",
            "Wrinkles (Face)",
            "Uneven Skin Tone"
        ],
        howWhy: "This formulation is a milder version of HQ8, with a lower hydroquinone concentration (4%) to reduce the risk of irritation while still effectively targeting hyperpigmentation. Hydroquinone and kojic acid work together to inhibit tyrosinase, reducing melanin production and lightening dark spots, though the effect is less intense than with HQ8. Tretinoin promotes cell turnover, shedding pigmented cells and unclogging pores to address mild acne, while also enhancing the penetration of hydroquinone for better efficacy. Hydrocortisone at 2% calms inflammation, which is particularly helpful for post-inflammatory hyperpigmentation (e.g., from acne) and mitigates tretinoin-induced irritation. Vitamin E provides antioxidant protection, reducing oxidative stress that can exacerbate pigmentation, and hydrates the skin to balance the drying effects of tretinoin. This cream is ideal for those with sensitive skin who need a gentler approach to pigmentation and acne.",
        howToUse: "Cleanse the face with a gentle, non-irritating cleanser and pat dry. Apply a pea-sized amount to the affected areas (e.g., dark spots) once daily at night. Spread in a thin, even layer, avoiding sensitive areas like the eyes, mouth, and nostrils. Start with 2-3 applications per week if new to tretinoin, increasing to nightly use as tolerated. Follow with a moisturizer after 10-15 minutes if dryness occurs. Apply a broad-spectrum sunscreen (SPF 30+) every morning. Use for 8-12 weeks, then consult a provider to assess progress and avoid prolonged hydroquinone use.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 3,
        name: "Topical Cream HQ6 Silicone Base",
        description: "A prescription cream combining dark spot correction with scar management, using hydroquinone to fade pigmentation and a silicone base to improve scar texture.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Hydroquinone", percentage: "6%" },
            { name: "Hydrocortisone", percentage: "0.5%" },
            { name: "Kojic Acid", percentage: "" },
            { name: "Tretinoin", percentage: "0.05%" },
            { name: "Silicone Base", percentage: "" }
        ],
        concerns: [
            "Hyperpigmentation",
            "Melasma",
            "Acne",
            "Scars",
            "Irritation"
        ],
        howWhy: "This cream combines pigmentation treatment with scar management. Hydroquinone (6%) and kojic acid target hyperpigmentation by inhibiting tyrosinase, reducing melanin production to lighten dark spots and melasma, with hydroquinone at a moderate concentration for balanced efficacy and tolerability. Tretinoin at 0.05% (higher than in HQ8/HQ4) accelerates cell turnover, shedding pigmented cells, unclogging pores to treat acne, and enhancing the penetration of hydroquinone and kojic acid for better results. Hydrocortisone at a lower dose (0.5%) reduces inflammation, minimizing irritation from tretinoin and addressing redness associated with hyperpigmentation or scars. The silicone base is a key feature for scar management, as it forms a protective barrier that hydrates the skin, reduces transepidermal water loss, and normalizes collagen production in scars, improving their texture and appearance. This formulation is ideal for those with both pigmentation and scarring concerns, such as post-acne marks.",
        howToUse: "Cleanse the skin with a gentle cleanser and pat dry. Apply a pea-sized amount to the affected areas (dark spots, melasma, or scars) once daily at night. For pigmentation, spread in a thin, even layer; for scars, massage gently into the scar tissue for 1-2 minutes to improve absorption. Start with 2-3 applications per week if new to tretinoin, increasing to nightly use as tolerated. Follow with a moisturizer after 10-15 minutes if dryness occurs. Apply a broad-spectrum sunscreen (SPF 30+) every morning. Use for 8-12 weeks for pigmentation; for scars, continue for 3-6 months for optimal results.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 4,
        name: "Topical Cream Scar 1",
        description: "An over-the-counter cream for scar management, using a silicone base to hydrate and improve the appearance of new or old scars while reducing dryness.",
        price: 55,
        Type: "OTC",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Vitamin E", percentage: "" },
            { name: "Silicone Base", percentage: "" }
        ],
        concerns: [
            "Scars",
            "Wrinkles (Face)",
            "Redness"
        ],
        howWhy: "This cream is designed for scar management, leveraging the hydrating and protective properties of a silicone base to improve scar appearance. The silicone base forms a semi-occlusive barrier over the scar, trapping moisture and reducing transepidermal water loss, which helps regulate fibroblast activity and prevent excessive collagen production—a key factor in hypertrophic scarring. This hydration also softens the scar tissue, making it less raised and more pliable over time. Vitamin E acts as an antioxidant, protecting the scar tissue from oxidative stress caused by free radicals, which can delay healing; it also provides hydration to counteract dryness around the scar. While Vitamin E’s efficacy for scars is debated, it may help reduce redness and support overall skin repair. This cream is a simple, non-invasive option for improving the appearance of both new and old scars.",
        howToUse: "Cleanse the area with a mild soap and water, then pat dry. Apply a thin layer to the scar twice daily (morning and night). Massage gently into the scar for 1-2 minutes to improve absorption and stimulate circulation. For new scars, start application only after the wound has fully closed (no open sores or scabs). For older scars, consistent use over 3-6 months may yield the best results. No sunscreen is required unless the scar is exposed to sunlight, in which case apply SPF 30+.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 5,
        name: "Topical Cream Scar 2",
        description: "A prescription cream for fresh scars at risk of infection, combining mupirocin to prevent bacterial growth and a silicone base to improve scar appearance.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Mupirocin", percentage: "2%" },
            { name: "Silicone Base", percentage: "" }
        ],
        concerns: [
            "Scars",
            "Infections",
            "Redness"
        ],
        howWhy: "This cream is tailored for fresh scars or wounds at risk of infection, combining the antibacterial properties of mupirocin with the scar-improving effects of a silicone base. Mupirocin targets bacterial infections by inhibiting protein synthesis in bacteria like Staphylococcus aureus and Streptococcus pyogenes, which are common culprits in wound infections; preventing infection is crucial for proper scar healing, as infections can lead to more pronounced scarring. The silicone base forms a protective barrier over the scar, maintaining a moist environment that supports healing and reduces excessive collagen production by fibroblasts, helping to prevent hypertrophic scarring. The silicone also softens and flattens the scar over time, improving its appearance. This formulation is particularly useful for post-surgical scars or fresh wounds where infection risk is a concern.",
        howToUse: "Cleanse the area with a mild soap and water, then pat dry. Apply a thin layer to the scar or wound twice daily (morning and night) for 7-10 days or as prescribed by a healthcare provider. Spread evenly over the area, ensuring full coverage of the scar or wound. Do not apply to open wounds unless directed by a provider, as mupirocin is for superficial use. For new scars, continue using the silicone base (without mupirocin, if the course is complete) for 3-6 months to optimize scar appearance. No sunscreen is required unless the scar is exposed to sunlight.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 6,
        name: "Topical Cream Scar 3 - Keloid Scars",
        description: "A prescription cream for keloid and hypertrophic scars, using a combination of actives to reduce scar size, flatten scars, and alleviate itching or pain.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Silicone Base", percentage: "" },
            { name: "5-Fluorouracil", percentage: "5%" },
            { name: "Triamcinolone", percentage: "0.3%" },
            { name: "Verapamil", percentage: "2.5%" }
        ],
        concerns: [
            "Keloid Scars",
            "Hypertrophic Scars",
            "Itching",
            "Pain"
        ],
        howWhy: "This cream is specifically formulated for keloid and hypertrophic scars, which are characterized by excessive collagen production and inflammation. 5-Fluorouracil (5-FU) inhibits cell proliferation by blocking DNA synthesis, reducing fibroblast activity and excessive collagen production in keloids, which helps shrink their size. Triamcinolone, a corticosteroid, reduces inflammation by inhibiting cytokine release and decreases collagen synthesis by fibroblasts, helping to flatten the scar and alleviate itching or pain. Verapamil, a calcium channel blocker, alters fibroblast activity by reducing calcium influx, which inhibits collagen synthesis and promotes collagen breakdown, further reducing keloid size. The silicone base complements these actives by hydrating the scar, creating a moist environment that normalizes collagen production and softens the scar tissue, improving its texture and appearance. This multi-faceted approach targets the root causes of keloid formation—excessive collagen and inflammation—making it a comprehensive treatment for challenging scars.",
        howToUse: "Cleanse the area with a mild soap and water, then pat dry. Apply a thin layer to the keloid scar once or twice daily as prescribed. Massage gently into the scar for 1-2 minutes to improve absorption and stimulate circulation. Use consistently for 3-6 months, as keloids are slow to respond; results may take longer for larger or older keloids. Monitor for side effects like skin thinning (from triamcinolone) or irritation (from 5-FU), and consult a provider if they occur. No sunscreen is required unless the scar is exposed to sunlight.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 7,
        name: "Serum VCS 30mL",
        description: "An over-the-counter serum for brightening and anti-aging, with Vitamin C to fade pigmentation and reduce fine lines, and hyaluronic acid for hydration.",
        price: 55,
        Type: "OTC",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Hyaluronic Acid", percentage: "2%" },
            { name: "Vitamin C", percentage: "20%" },
            { name: "Vitamin C", percentage: "15%" },
            { name: "Vitamin C", percentage: "10%" }
        ],
        concerns: [
            "Dull Skin",
            "Uneven Skin Tone",
            "Fine Lines",
            "Dryness",
            "Hyperpigmentation"
        ],
        howWhy: "This serum is designed for skin brightening, hydration, and anti-aging. Vitamin C, present in three concentrations (20%, 15%, 10%), likely includes different forms (e.g., ascorbic acid, magnesium ascorbyl phosphate, ascorbyl glucoside) to provide a broad-spectrum effect: it acts as a potent antioxidant, neutralizing free radicals from UV exposure and pollution that cause oxidative stress, which can lead to dullness and premature aging. Vitamin C also inhibits tyrosinase, reducing melanin production to fade mild hyperpigmentation and brighten the skin, while stimulating collagen synthesis to reduce fine lines. Hyaluronic acid at 2% provides intense hydration by attracting and retaining water, plumping the skin and improving its texture, which enhances the overall radiance achieved by Vitamin C. The combination of multiple Vitamin C forms ensures both immediate and sustained brightening effects, with the lower concentrations being gentler to minimize irritation. This serum is ideal for daily use to improve skin tone, hydration, and early signs of aging.",
        howToUse: "Cleanse the face with a gentle cleanser and pat dry. Apply 3-5 drops of the serum to the face and neck in the morning. Spread evenly with fingertips, avoiding the eye area. Allow to absorb for 1-2 minutes, then follow with a moisturizer to lock in hydration. Apply a broad-spectrum sunscreen (SPF 30+) afterward, as Vitamin C can increase photosensitivity. Can be used daily; if irritation occurs, reduce to every other day. Store in a cool, dark place to maintain Vitamin C stability.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 8,
        name: "Topical Cream INT 30g/50g",
        description: "A prescription cream to treat hyperpigmentation and dry, rough skin, using hydroquinone to fade dark spots and urea to hydrate and exfoliate.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Urea", percentage: "10%" },
            { name: "Hydroquinone", percentage: "4%" },
            { name: "Lactic Acid", percentage: "" },
            { name: "Kojic Acid", percentage: "" }
        ],
        concerns: [
            "Hyperpigmentation",
            "Melasma",
            "Dryness",
            "Uneven Texture"
        ],
        howWhy: "This cream addresses both hyperpigmentation and dry, rough skin through a combination of lightening and exfoliating agents. Hydroquinone (4%) and kojic acid target pigmentation by inhibiting tyrosinase, reducing melanin production to lighten dark spots and melasma; hydroquinone provides the primary lightening effect, while kojic acid enhances it with a gentler mechanism. Lactic acid, an alpha hydroxy acid (AHA), exfoliates by breaking down desmosomes (bonds between skin cells), promoting the shedding of pigmented cells and improving skin texture; it also hydrates by attracting water to the skin, complementing urea’s moisturizing effects. Urea at 10% acts as a keratolytic, softening and exfoliating dry, rough skin by breaking down keratin, while also drawing moisture into the skin as a humectant. Together, these ingredients lighten pigmentation, exfoliate dead skin, and hydrate, making this cream ideal for those with both pigmentation and dryness concerns, such as in melasma with associated skin roughness.",
        howToUse: "Cleanse the face with a gentle cleanser and pat dry. Apply a pea-sized amount to the affected areas (e.g., dark spots or rough patches) once daily at night. Spread in a thin, even layer, avoiding the eyes, mouth, and nostrils. Start with 2-3 applications per week if sensitive to AHAs (lactic acid), increasing to nightly use as tolerated. Follow with a moisturizer after 10-15 minutes if dryness occurs. Apply a broad-spectrum sunscreen (SPF 30+) every morning. Use for 8-12 weeks, then consult a provider to avoid prolonged hydroquinone use.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 9,
        name: "Topical Cream 130g",
        description: "An over-the-counter cream for hyperpigmentation, acne, and uneven texture, with niacinamide to reduce redness and AHAs to exfoliate, plus argan oil for hydration.",
        price: 55,
        Type: "OTC",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Niacinamide", percentage: "" },
            { name: "Lactic Acid", percentage: "" },
            { name: "Glycolic Acid", percentage: "" },
            { name: "Argan Oil", percentage: "" }
        ],
        concerns: [
            "Hyperpigmentation",
            "Acne",
            "Uneven Texture",
            "Dryness",
            "Redness"
        ],
        howWhy: "This cream is a versatile treatment for multiple skin concerns, combining exfoliation, anti-inflammatory, and hydrating properties. Niacinamide reduces hyperpigmentation by inhibiting melanosome transfer from melanocytes to keratinocytes, while also decreasing inflammation by suppressing pro-inflammatory cytokines, which helps with redness and acne. Lactic acid and glycolic acid, both AHAs, exfoliate by breaking down desmosomes, promoting cell turnover to fade pigmentation, improve skin texture, and unclog pores to reduce acne; glycolic acid, with its smaller molecular size, penetrates deeper for more pronounced exfoliation, while lactic acid also hydrates. Argan oil provides hydration and nourishment with its fatty acids and antioxidants, counteracting the drying effects of AHAs and supporting skin repair. This formulation balances exfoliation with hydration, making it effective for hyperpigmentation, acne, and uneven texture while maintaining skin barrier health.",
        howToUse: "Cleanse the face with a gentle cleanser and pat dry. Apply a pea-sized amount to the face (or affected areas) once daily at night. Spread in a thin, even layer, avoiding the eyes, mouth, and nostrils. Start with 2-3 applications per week if new to AHAs (lactic and glycolic acids), increasing to nightly use as tolerated. Follow with a moisturizer after 10-15 minutes if dryness or irritation occurs. Apply a broad-spectrum sunscreen (SPF 30+) every morning. Use consistently for 6-8 weeks to see improvements in texture and pigmentation.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 10,
        name: "Topical Cream UE 15g",
        description: "An over-the-counter eye cream to reduce under-eye puffiness, dark circles, and fine lines, with caffeine to improve circulation and Vitamin E to hydrate.",
        price: 55,
        Type: "OTC",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Caffeine", percentage: "1%" },
            { name: "Vitamin E", percentage: "4%" },
            { name: "Vitamin K", percentage: "" }
        ],
        concerns: [
            "Puffiness",
            "Dark Circles",
            "Fine Lines",
            "Bruising"
        ],
        howWhy: "This cream targets under-eye concerns with a focus on reducing puffiness and dark circles. Caffeine acts as a vasoconstrictor, reducing blood vessel dilation under the eyes, which decreases puffiness and the appearance of dark circles caused by blood pooling; it also improves microcirculation to enhance skin tone. Vitamin E provides antioxidant protection, neutralizing free radicals that can contribute to skin aging, and hydrates the delicate under-eye area to reduce the appearance of fine lines. Vitamin K may improve blood clotting and microcirculation, potentially reducing dark circles caused by broken capillaries or bruising, though its efficacy is variable. Together, these ingredients address puffiness, dark circles, and early signs of aging in the under-eye area, making this cream a targeted solution for tired-looking eyes.",
        howToUse: "Cleanse the face with a gentle cleanser and pat dry. Apply a small amount (about the size of a grain of rice) to the under-eye area twice daily (morning and night). Gently pat with your ring finger to avoid tugging the delicate skin; do not rub. Allow to absorb for 1-2 minutes before applying other products (e.g., moisturizer or makeup). Use consistently for 4-6 weeks to see improvements in puffiness and dark circles. No sunscreen is required for the under-eye area unless exposed to direct sunlight.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 11,
        name: "Solution HLM1 50mL",
        description: "A prescription solution for androgenetic alopecia, using minoxidil to promote hair regrowth and finasteride to reduce DHT, while addressing scalp inflammation.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Minoxidil", percentage: "5%" },
            { name: "Tretinoin", percentage: "0.025%" },
            { name: "Fluocinolone", percentage: "0.01%" },
            { name: "Finasteride", percentage: "0.1%" }
        ],
        concerns: [
            "Hair Loss",
            "Scalp Inflammation",
            "Thinning Hair"
        ],
        howWhy: "This solution is designed for androgenetic alopecia (male or female pattern hair loss) with a focus on promoting hair regrowth and addressing scalp inflammation. Minoxidil stimulates hair follicles by increasing blood flow and prolonging the anagen (growth) phase, encouraging the growth of thicker, longer hairs. Tretinoin enhances minoxidil’s efficacy by increasing scalp cell turnover, which improves absorption through the stratum corneum, and may also stimulate follicular activity. Finasteride inhibits 5-alpha-reductase, reducing DHT levels—a hormone that shrinks hair follicles in androgenetic alopecia—thereby slowing hair loss and supporting regrowth. Fluocinolone, a corticosteroid, reduces scalp inflammation by inhibiting cytokine release, which is crucial because conditions like seborrheic dermatitis or irritation can hinder hair growth. This formulation tackles hair loss from multiple angles: stimulating growth, reducing DHT, and improving scalp health.",
        howToUse: "Ensure the scalp is clean and dry (e.g., after a shower, wait until fully dry). Apply 1 mL of the solution to the affected areas of the scalp twice daily (morning and night). Use the dropper to apply directly to the scalp, then massage gently with fingertips to distribute evenly. Do not rinse; allow to dry naturally (takes about 10-15 minutes). Wash hands thoroughly after application to avoid transferring to other areas. Use consistently for 3-6 months to see results; hair regrowth may stop if treatment is discontinued. Avoid applying to irritated or broken skin, and monitor for side effects like scalp irritation or unwanted facial hair growth.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 12,
        name: "Solution HLM2 50mL",
        description: "A potent prescription solution for androgenetic alopecia and scalp conditions, with a higher minoxidil dose to promote hair regrowth and ketoconazole to treat dandruff.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Minoxidil", percentage: "7%" },
            { name: "Ketoconazole", percentage: "2%" },
            { name: "Biotin", percentage: "0.1%" },
            { name: "Finasteride", percentage: "2%" }
        ],
        concerns: [
            "Hair Loss",
            "Dandruff",
            "Seborrheic Dermatitis",
            "Thinning Hair"
        ],
        howWhy: "This solution is a more potent version of HLM1, with a higher minoxidil concentration (7%) to stimulate hair regrowth more aggressively by increasing blood flow to hair follicles and extending the anagen phase, promoting thicker, longer hairs. Finasteride at 2% provides a stronger inhibition of 5-alpha-reductase, significantly reducing DHT levels to slow hair loss and support regrowth, making it particularly effective for androgenetic alopecia. Ketoconazole addresses scalp health by acting as an antifungal, inhibiting ergosterol synthesis in fungal cell membranes to treat dandruff and seborrheic dermatitis; it also has anti-androgenic effects, further reducing DHT levels. Biotin supports hair health by contributing to keratin production, though its topical efficacy is limited compared to oral supplementation. This formulation is ideal for those with hair loss and scalp conditions, offering a comprehensive approach to hair regrowth and scalp health.",
        howToUse: "Ensure the scalp is clean and dry. Apply 1 mL of the solution to the affected areas of the scalp twice daily (morning and night). Use the dropper to apply directly to the scalp, then massage gently with fingertips. Allow to dry naturally (10-15 minutes); do not rinse. Wash hands thoroughly after application. Use consistently for 3-6 months; monitor for side effects like scalp irritation or systemic absorption of finasteride (e.g., sexual side effects in men). Avoid applying to irritated or broken skin.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 13,
        name: "Solution HLF1 50mL",
        description: "A prescription solution for hair loss, likely in women, using minoxidil to promote regrowth and progesterone to address hormonal factors, while reducing scalp irritation.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Minoxidil", percentage: "5%" },
            { name: "Tretinoin", percentage: "0.025%" },
            { name: "Hydrocortisone", percentage: "0.5%" },
            { name: "Progesterone", percentage: "0.25%" }
        ],
        concerns: [
            "Hair Loss",
            "Scalp Irritation",
            "Thinning Hair"
        ],
        howWhy: "This solution is tailored for hair loss, likely in women, given the inclusion of progesterone. Minoxidil stimulates hair follicles by increasing blood flow and prolonging the anagen phase, promoting hair regrowth. Tretinoin enhances minoxidil’s efficacy by increasing scalp cell turnover, improving absorption, and potentially stimulating follicular activity. Hydrocortisone reduces scalp inflammation by inhibiting cytokine release, creating a better environment for hair growth, especially if irritation or conditions like seborrheic dermatitis are present. Progesterone may have anti-androgenic effects by inhibiting 5-alpha-reductase or competing with androgens at the receptor level, reducing DHT levels, which is particularly beneficial for female pattern hair loss where hormonal factors play a role. This formulation supports hair regrowth while addressing scalp health and hormonal influences.",
        howToUse: "Ensure the scalp is clean and dry. Apply 1 mL of the solution to the affected areas of the scalp twice daily (morning and night). Use the dropper to apply directly to the scalp, then massage gently with fingertips. Allow to dry naturally (10-15 minutes); do not rinse. Wash hands thoroughly after application. Use consistently for 3-6 months; monitor for side effects like scalp irritation. Avoid applying to irritated or broken skin.",
        pairsWith: [],
        topIcon: "Most Prescribed",
        sideIcon: "/assets/logo4.png"
    },
    {
        id: 14,
        name: "Solution HLF2 50mL",
        description: "A prescription solution for hair loss and scalp conditions, using minoxidil to promote regrowth, ketoconazole to treat dandruff, and caffeine to stimulate follicles.",
        price: 55,
        Type: "RX",
        imageUrl: "/assets/Fusion_Sample_Product.jpeg",
        ingredients: [
            { name: "Minoxidil", percentage: "5%" },
            { name: "Ketoconazole", percentage: "2%" },
            { name: "Biotin", percentage: "0.1%" },
            { name: "Caffeine", percentage: "0.5%" }
        ],
        concerns: [
            "Hair Loss",
            "Dandruff",
            "Seborrheic Dermatitis",
            "Thinning Hair"
        ],
        howWhy: "This solution targets hair loss and scalp health with a multi-faceted approach. Minoxidil stimulates hair follicles by increasing blood flow and prolonging the anagen phase, promoting hair regrowth. Ketoconazole addresses scalp conditions like dandruff and seborrheic dermatitis by inhibiting ergosterol synthesis in fungal cell membranes, reducing inflammation; it also has anti-androgenic effects, lowering DHT levels to support hair growth. Biotin supports hair health by contributing to keratin production, though its topical efficacy is limited. Caffeine stimulates hair follicles by inhibiting phosphodiesterase, increasing cyclic AMP levels, which promotes follicular activity and improves scalp circulation. This formulation is ideal for those with hair loss and scalp issues, combining hair regrowth stimulation with scalp health improvement.",
        howToUse: "Ensure the scalp is clean and dry. Apply 1 mL of the solution to the affected areas of the scalp twice daily (morning and night). Use the dropper to apply directly to the scalp, then massage gently with fingertips. Allow to dry naturally (10-15 minutes); do not rinse. Wash hands thoroughly after application. Use consistently for 3-6 months; monitor for side effects like scalp irritation. Avoid applying to irritated or broken skin.",
        pairsWith: [],
        topIcon: "Best Seller",
        sideIcon: "/assets/logo4.png"
    }
];

const rawConcerns = [
    {
        name: "Melasma",
        main_concern_name: "Dark Spots",
        imageUrl: "/assets/concern_FrecklesFace2.jpg",
    },
    {
        name: "Wrinkles (Face)",
        main_concern_name: "Anti-Aging",
        imageUrl: "/assets/concern_WrinklesFace.jpg",
    },
    {
        name: "Thinning (Women)",
        main_concern_name: "Aging-Hair",
        imageUrl: "/assets/concern_Thinning2.jpg",
    },
    {
        name: "Hot Flashes",
        main_concern_name: "Menopause",
        imageUrl: "/assets/concern_HotFlashes.jpg",
    },
    {
        name: "Migraine",
        main_concern_name: "Migraine",
        imageUrl: "/assets/Migraine.jpg",
    },
    {
        name: "Scars",
        main_concern_name: "Scars",
        imageUrl: "/assets/concern_AcneScarsFace.jpg",
    },
];

const rawIngredients = [
    {
        name: "Acne",
        imageUrl: "/assets/concern_AcneScarsFace.jpg",
    },
];

// Step 2: Create the maps

// Map 1.a: Product name to product data
export const productMap = new Map();
rawProducts.forEach((product) => {
    productMap.set(product.name, product);
});
export const productMapId = new Map();
// Assuming rawProducts contains an array of product data
rawProducts.forEach((product) => {
  // Create map with product ID as the key
  productMapId.set(product.id, product);
});

// Map 1.b: Concern name to Concern imgUrl
export const concernMapUrl = new Map();
rawConcerns.forEach((concern) => {
    concernMapUrl.set(concern.name, concern.imageUrl);
});

// Map 1.c: Ingredient name to ingredient imgUrl
export const ingredientsMapUrl = new Map();
rawIngredients.forEach((ingredient) => {
    ingredientsMapUrl.set(ingredient.name, ingredient.imageUrl);
});

// Map 2.a: Concern to array of product names
export const concernMap = new Map();
rawProducts.forEach((product) => {
    product.concerns.forEach((concern) => {
        if (!concernMap.has(concern)) {
            concernMap.set(concern, []);
        }
        concernMap.get(concern).push(product.name);
    });
});

// Map 2.b: MainConcern to array of Concerns
export const mainConcernMap = new Map();
rawConcerns.forEach((concern) => {
    const { main_concern_name, name } = concern;
    if (!mainConcernMap.has(main_concern_name)) {
        mainConcernMap.set(main_concern_name, []);
    }
    mainConcernMap.get(main_concern_name).push(name);
});

// Map 3: Ingredient to array of product names
export const ingredientMap = new Map();
rawProducts.forEach((product) => {
    product.ingredients.forEach((ingredient) => {
        if (!ingredientMap.has(ingredient)) {
            ingredientMap.set(ingredient, []);
        }
        ingredientMap.get(ingredient).push(product.name);
    });
});

// Export raw products for other uses (e.g., pagination in Home)
export const products = rawProducts;

// Utility function to get products by IDs
export const getProductsByIds = (productIds) => {
    return rawProducts.filter((product) =>
        productIds.includes(product.id)
    );
};