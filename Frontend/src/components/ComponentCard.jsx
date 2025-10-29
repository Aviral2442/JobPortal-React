import { useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Collapse } from 'react-bootstrap';
import { TbChevronDown, TbRefresh, TbX } from 'react-icons/tb';
import clsx from 'clsx';

const ComponentCard = ({
  title,
  isCloseable,
  isCollapsible,
  isRefreshable,
  isLink,       // Pass a custom element/content for header
  className,
  bodyClassName,
  children,
  defaultOpen = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(defaultOpen); // collapsed = not open
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClose = () => setIsVisible(false);
  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  if (!isVisible) return null;

  // Determine if border should be visible
  const showBorder =
    (isCollapsible && !isCollapsed) || // Collapsible and expanded
    (!isCollapsible && isLink) ||       // Non-collapsible but has header content
    (!!isLink);                         // Always show if any custom content is passed

  return (
    <Card className={clsx(isCollapsed && 'card-collapse', className)}>
      {isRefreshing && (
        <div className="card-overlay">
          <div className="spinner-border text-primary" />
        </div>
      )}

      {/* Header with conditional border */}
      <CardHeader
        className="d-flex justify-content-between align-items-center"
        style={{
          borderBottom: showBorder ? '1px dashed #dee2e6' : 'none',
        }}
      >
        <CardTitle className="mb-0">{title}</CardTitle>

        <div className="d-flex align-items-center gap-2">
          {isCollapsible && (
            <span className="card-action-item" onClick={handleToggle}>
              <TbChevronDown style={{ rotate: isCollapsed ? '0deg' : '180deg' }} />
            </span>
          )}
          {isRefreshable && (
            <span className="card-action-item" onClick={handleRefresh}>
              <TbRefresh />
            </span>
          )}
          {isCloseable && (
            <span className="card-action-item" onClick={handleClose}>
              <TbX />
            </span>
          )}
          {isLink && (
            <div className="card-action-item icon-link icon-link-hover link-secondary link-underline-opacity-25 fw-semibold">
              {isLink}
            </div>
          )}
        </div>
      </CardHeader>

      {isCollapsible ? (
        <Collapse in={!isCollapsed}>
          <CardBody className={bodyClassName}>{children}</CardBody>
        </Collapse>
      ) : (
        <CardBody className={bodyClassName}>{children}</CardBody>
      )}
    </Card>
  );
};

export default ComponentCard;
