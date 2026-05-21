// Auto-generated — do not edit manually. Run: node scripts/generate-tokens.js
// Room Rental Design System — v2.0.0 — 2026-05-21
// MudBlazor 9.x

using MudBlazor;

namespace RoomRental.Design;

/// <summary>
/// Central MudBlazor theme for all Blazor WASM applications in the Room Rental system.
/// Usage in Program.cs: builder.Services.AddMudServices(c => c.Theme = RoomRentalTheme.Create());
/// </summary>
public static class RoomRentalTheme
{
    public static MudTheme Create() => new()
    {
        PaletteLight = new PaletteLight
        {
            Primary            = "#67C090",
            PrimaryContrastText= "#124170",
            PrimaryDarken      = "#4DA07A",
            PrimaryLighten     = "#EAF8F1",

            Secondary            = "#124170",
            SecondaryContrastText= "#FFFFFF",
            SecondaryDarken      = "#0C2E53",
            SecondaryLighten     = "#DDE9F2",

            Tertiary            = "#26667F",
            TertiaryContrastText= "#FFFFFF",
            TertiaryLighten     = "#C5DCE6",

            Success = "#67C090",
            Error   = "#C62828",
            Warning = "#E65100",
            Info    = "#26667F",

            Background       = "#DDF4E7",
            Surface          = "#FFFFFF",
            DrawerBackground = "#124170",
            AppbarBackground = "#124170",
            AppbarText       = "#FFFFFF",

            TextPrimary   = "#0F1E2D",
            TextSecondary = "#3D5970",
            TextDisabled  = "rgba(18,65,112,0.38)",

            Divider      = "rgba(18,65,112,0.12)",
            DividerLight = "rgba(18,65,112,0.24)",

            OverlayDark  = "rgba(0,0,0,0.5)",
            OverlayLight = "rgba(255,255,255,0.7)",

            Black = "#000000",
            White = "#FFFFFF",
        },

        PaletteDark = new PaletteDark
        {
            Primary            = "#67C090",
            PrimaryContrastText= "#124170",
            PrimaryDarken      = "#4DA07A",
            PrimaryLighten     = "#EAF8F1",

            Secondary            = "#26667F",
            SecondaryContrastText= "#FFFFFF",
            SecondaryDarken      = "#0C2E53",

            Tertiary            = "#DDF4E7",
            TertiaryContrastText= "#124170",

            Success = "#67C090",
            Error   = "#EF5350",
            Warning = "#FFA726",
            Info    = "#4A9BB5",

            Background       = "#0A1B2E",
            Surface          = "#124170",
            DrawerBackground = "#0D2440",
            AppbarBackground = "#0D2440",
            AppbarText       = "#DDF4E7",

            TextPrimary   = "#DDF4E7",
            TextSecondary = "rgba(221,244,231,0.70)",
            TextDisabled  = "rgba(221,244,231,0.38)",

            Divider      = "rgba(221,244,231,0.12)",
            DividerLight = "rgba(221,244,231,0.06)",

            OverlayDark  = "rgba(0,0,0,0.7)",
            OverlayLight = "rgba(221,244,231,0.08)",

            Black = "#000000",
            White = "#FFFFFF",
        },

        Typography = new Typography
        {
            Default = new Default
            {
                FontFamily = ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
                FontSize   = "0.875rem",
                FontWeight = 400,
                LineHeight = 1.5,
            },
            H1 = new H1 { FontSize = "2rem", FontWeight = 400 },
            H2 = new H2 { FontSize = "1.5rem", FontWeight = 400 },
            H3 = new H3 { FontSize = "1.25rem", FontWeight = 400 },
            H4 = new H4 { FontSize = "1.125rem", FontWeight = 500 },
            H5 = new H5 { FontSize = "1rem", FontWeight = 500 },
            H6 = new H6 { FontSize = "0.875rem", FontWeight = 500 },
            Subtitle1 = new Subtitle1 { FontSize = "0.875rem", FontWeight = 400 },
            Subtitle2 = new Subtitle2 { FontSize = "0.75rem", FontWeight = 500 },
            Body1   = new Body1   { FontSize = "0.875rem",  FontWeight = 400 },
            Body2   = new Body2   { FontSize = "0.75rem",  FontWeight = 400 },
            Caption = new Caption { FontSize = "0.75rem", FontWeight = 400 },
            Button  = new Button  { FontSize = "0.875rem",  FontWeight = 600, TextTransform = "uppercase" },
            Overline= new Overline{ FontSize = "0.6875rem", FontWeight = 400, TextTransform = "uppercase" },
        },

        LayoutProperties = new LayoutProperties
        {
            DefaultBorderRadius = "8px",
            DrawerWidthLeft     = "260px",
            DrawerWidthRight    = "300px",
            DrawerMiniWidthLeft = "56px",
            AppbarHeight        = "64px",
        },
    };
}
