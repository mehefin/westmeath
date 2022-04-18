static int topbar = 1;                      /* -b  option; if 0, dmenu appears at bottom     */
static int centered = 0;                    /* -c option; centers dmenu on screen */
static int min_width = 1900;                    /* minimum width when centered */
/* -fn option overrides fonts[0]; default X11 font or font set */
static const char *fonts[] = {
	"Monofurbold Nerd Font:size=13:antialias=true:autohint:true"
};
static const char *prompt      = NULL;      /* -p option; prompt to the left of input field */
static const char *colors[SchemeLast][2] = {
	/*     fg         bg       */
	[SchemeNorm] = { "#dfc3a8", "#09070d" },
	[SchemeSel] = { "#09070d", "#e89494" }, 
	[SchemeSelHighlight] = { "#b77859", "#09070d" },
	[SchemeNormHighlight] = { "#09070d", "#b77859" },
	[SchemeOut] = { "#09070d", "#dfc3a8" },
	[SchemeMid] = { "#09070d", "#dfc3a8" },
};
/* -l option; if nonzero, dmenu uses vertical list with given number of lines */
static unsigned int lines      = 0;
static unsigned int lineheight = 24;         /* -h option; minimum height of a menu line     */

/*
 * Characters not considered part of a word while deleting words
 * for example: " /?\"&[]"
 */
static const char worddelimiters[] = " ";

/* Size of the window border */
static unsigned int border_width = 0;  /* -bw option; to add border width */
