/**
 * Celebration Layout Constants
 *
 * Defines the coordinate system for the celebration screen's
 * bookshelf background and character positioning.
 *
 * Key concept: The background uses contentFit="cover", which means
 * the image may be scaled and cropped. Character positioning must
 * account for the effective drawn image rect, not raw screen dimensions.
 *
 * Coordinate flow:
 * 1. Background intrinsic space (1536×2784)
 * 2. Cover-scaled space (drawn rect within screen)
 * 3. Screen space (final pixel positions)
 */

// ============================================================================
// Background Constants
// ============================================================================

/**
 * Celebration background (tools_shell) dimensions and anchors.
 * Based on @2x master asset: tools_shell__master.png
 */
export const CELEBRATION_BG = {
  /** Background intrinsic width in pixels (@2x) */
  WIDTH: 1536,
  /** Background intrinsic height in pixels (@2x) */
  HEIGHT: 2784,
  /** Background aspect ratio (width / height) */
  ASPECT: 1536 / 2784,
  /**
   * Feet anchor Y position as ratio of background height.
   * This is where character feet should land in background-space.
   * Value calibrated to match the visual floor line in tools_shell.
   * ~79% down from top of background image.
   */
  FEET_ANCHOR_Y_RATIO: 0.79,
} as const;

// ============================================================================
// Character Constants
// ============================================================================

/**
 * Character dimensions and positioning for celebration screen.
 * Based on @2x character assets (768×1392).
 */
export const CELEBRATION_CHARACTER = {
  /** Character intrinsic width in pixels (@2x) */
  WIDTH: 768,
  /** Character intrinsic height in pixels (@2x) */
  HEIGHT: 1392,
  /**
   * Character width as ratio of background drawn width.
   * Controls how large the character appears relative to background.
   * ~50% of background width.
   */
  WIDTH_RATIO: 0.5,
  /**
   * Foot anchor Y position as ratio of character height.
   * This is where the character's feet are within the character image.
   * Value calibrated to match girl_age20_base foot position.
   * ~96% down from top of character image.
   */
  FOOT_Y_RATIO: 0.96,
} as const;

// ============================================================================
// Cover Image Rect Calculation
// ============================================================================

/**
 * Computed rect for an image displayed with contentFit="cover".
 */
export interface CoverImageRect {
  /** Top position in screen pixels (may be negative if cropped) */
  top: number;
  /** Left position in screen pixels (may be negative if cropped) */
  left: number;
  /** Drawn width in screen pixels (may exceed screen width) */
  width: number;
  /** Drawn height in screen pixels (may exceed screen height) */
  height: number;
}

/**
 * Calculate the effective drawn rect for an image with contentFit="cover".
 *
 * Cover mode scales the image to fill the container while maintaining
 * aspect ratio. The image may overflow and be cropped on edges.
 *
 * @param screenWidth - Container width in screen pixels
 * @param screenHeight - Container height in screen pixels
 * @param imageWidth - Image intrinsic width
 * @param imageHeight - Image intrinsic height
 * @returns The computed rect of the drawn image
 */
export function getCoverImageRect(
  screenWidth: number,
  screenHeight: number,
  imageWidth: number,
  imageHeight: number
): CoverImageRect {
  const screenAspect = screenWidth / screenHeight;
  const imageAspect = imageWidth / imageHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (screenAspect > imageAspect) {
    // Screen is wider than image - scale to fill width, overflow height
    drawWidth = screenWidth;
    drawHeight = screenWidth / imageAspect;
  } else {
    // Screen is taller/narrower than image - scale to fill height, overflow width
    drawHeight = screenHeight;
    drawWidth = screenHeight * imageAspect;
  }

  // Center the drawn image
  const left = (screenWidth - drawWidth) / 2;
  const top = (screenHeight - drawHeight) / 2;

  return { top, left, width: drawWidth, height: drawHeight };
}

// ============================================================================
// Character Layout Calculation
// ============================================================================

/**
 * Character layout for celebration screen.
 */
export interface CelebrationCharacterLayout {
  /** Top position in screen pixels */
  top: number;
  /** Left position in screen pixels */
  left: number;
  /** Width in screen pixels */
  width: number;
  /** Height in screen pixels */
  height: number;
}

/**
 * Calculate character layout for the celebration screen.
 *
 * The character is:
 * - Centered horizontally
 * - Vertically positioned so feet align with background feet anchor
 * - Scaled relative to the background's drawn width
 *
 * @param screenWidth - Screen width in pixels
 * @param screenHeight - Screen height in pixels
 * @returns Character layout in screen pixels
 */
export function getCelebrationCharacterLayout(
  screenWidth: number,
  screenHeight: number
): CelebrationCharacterLayout {
  // Get the effective background rect after cover scaling
  const bgRect = getCoverImageRect(
    screenWidth,
    screenHeight,
    CELEBRATION_BG.WIDTH,
    CELEBRATION_BG.HEIGHT
  );

  // Calculate character dimensions based on background drawn width
  const charWidth = bgRect.width * CELEBRATION_CHARACTER.WIDTH_RATIO;
  const charAspect = CELEBRATION_CHARACTER.WIDTH / CELEBRATION_CHARACTER.HEIGHT;
  const charHeight = charWidth / charAspect;

  // Calculate background feet anchor in screen space
  const bgFeetY = bgRect.top + bgRect.height * CELEBRATION_BG.FEET_ANCHOR_Y_RATIO;

  // Position character so feet align with background anchor
  // Character feet Y = charTop + charHeight * FOOT_Y_RATIO
  // Solve for charTop: charTop = bgFeetY - charHeight * FOOT_Y_RATIO
  const charTop = bgFeetY - charHeight * CELEBRATION_CHARACTER.FOOT_Y_RATIO;

  // Center character horizontally
  const charLeft = (screenWidth - charWidth) / 2;

  return {
    top: charTop,
    left: charLeft,
    width: charWidth,
    height: charHeight,
  };
}
