const Campaign = require('../models').campaigns;
const User = require('../models').users;
const Helper = require('../utils/Helper');

/**
 * Check Campaign Availability
 */
exports.checkCampaignAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { profileCode } = req.body;
        let where = { id: id };

        const campaign = await Campaign.findOne({ where });
        if (campaign) {
            const user = await User.findOne({ where: { profileCode: profileCode, campaignId: id } });
            if (user) {
                const data = {
                    isCampaignActive: campaign.is_active,
                    hasRedeemed: user.hasRedeemed,
                    link: Helper.shareLink(profileCode)
                }
                return res.json({
                    code: 200,
                    data: data,
                });
            } else {
                return next(new Error('Invalid profile code'));
            }
        } else {
            return next(new Error('Campaign does not exist.'));
        }
    } catch (error) {
        return next(error);
    }
};
